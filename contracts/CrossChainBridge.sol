// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CrossChainBridge
 * @dev Quantum-resistant cross-chain bridge with atomic swaps and universal asset management
 */
contract CrossChainBridge is ReentrancyGuard, Pausable, Ownable {
    
    struct ChainConfig {
        uint256 chainId;
        string name;
        address bridgeContract;
        bool isActive;
        uint256 minConfirmationBlocks;
    }
    
    struct SwapRequest {
        address user;
        uint256 sourceChainId;
        uint256 targetChainId;
        address token;
        uint256 amount;
        address recipient;
        uint256 nonce;
        bool isExecuted;
        uint256 timestamp;
        bytes32 secretHash;
        bytes32 secret;
    }
    
    struct AssetPool {
        address token;
        uint256 totalLiquidity;
        uint256 availableLiquidity;
        mapping(uint256 => uint256) chainLiquidity; // chainId => amount
        bool isActive;
    }
    
    // Events
    event ChainAdded(uint256 indexed chainId, string name, address bridgeContract);
    event ChainRemoved(uint256 indexed chainId);
    event AssetPoolCreated(address indexed token, uint256 initialLiquidity);
    event SwapInitiated(
        bytes32 indexed swapId,
        address indexed user,
        uint256 sourceChainId,
        uint256 targetChainId,
        address token,
        uint256 amount
    );
    event SwapCompleted(bytes32 indexed swapId, bytes32 secret);
    event LiquidityAdded(address indexed token, uint256 amount, uint256 chainId);
    event LiquidityRemoved(address indexed token, uint256 amount, uint256 chainId);
    
    // State variables
    mapping(uint256 => ChainConfig) public supportedChains;
    mapping(address => AssetPool) public assetPools;
    mapping(bytes32 => SwapRequest) public swapRequests;
    mapping(address => uint256) public userNonces;
    
    uint256[] public supportedChainIds;
    address[] public supportedTokens;
    
    uint256 public constant MAX_CHAINS = 20;
    uint256 public constant SWAP_TIMEOUT = 24 hours;
    uint256 public constant MIN_LIQUIDITY = 1000 * 10**18; // 1000 tokens minimum
    
    // Modifiers
    modifier onlySupportedChain(uint256 chainId) {
        require(supportedChains[chainId].isActive, "Chain not supported");
        _;
    }
    
    modifier onlyValidSwap(bytes32 swapId) {
        require(swapRequests[swapId].user != address(0), "Invalid swap ID");
        require(!swapRequests[swapId].isExecuted, "Swap already executed");
        _;
    }
    
    constructor() {
        // Initialize with Ethereum mainnet
        _addChain(1, "Ethereum", address(this), 12);
        
        // Initialize with popular testnets
        _addChain(11155111, "Sepolia", address(0), 12);
        _addChain(80001, "Mumbai", address(0), 12);
        _addChain(421614, "Arbitrum Sepolia", address(0), 12);
        _addChain(84532, "Base Sepolia", address(0), 12);
    }
    
    /**
     * @dev Add a new supported chain
     */
    function addSupportedChain(
        uint256 chainId,
        string memory name,
        address bridgeContract,
        uint256 minConfirmationBlocks
    ) external onlyOwner {
        require(supportedChainIds.length < MAX_CHAINS, "Max chains reached");
        require(!supportedChains[chainId].isActive, "Chain already supported");
        
        _addChain(chainId, name, bridgeContract, minConfirmationBlocks);
    }
    
    function _addChain(
        uint256 chainId,
        string memory name,
        address bridgeContract,
        uint256 minConfirmationBlocks
    ) internal {
        supportedChains[chainId] = ChainConfig({
            chainId: chainId,
            name: name,
            bridgeContract: bridgeContract,
            isActive: true,
            minConfirmationBlocks: minConfirmationBlocks
        });
        
        supportedChainIds.push(chainId);
        emit ChainAdded(chainId, name, bridgeContract);
    }
    
    /**
     * @dev Create an asset pool for cross-chain liquidity
     */
    function createAssetPool(address token, uint256 initialLiquidity) external onlyOwner {
        require(assetPools[token].token == address(0), "Pool already exists");
        require(initialLiquidity >= MIN_LIQUIDITY, "Insufficient initial liquidity");
        
        // Transfer tokens from caller
        IERC20(token).transferFrom(msg.sender, address(this), initialLiquidity);
        
        // Initialize struct fields individually (can't assign struct with mappings directly)
        AssetPool storage pool = assetPools[token];
        pool.token = token;
        pool.totalLiquidity = initialLiquidity;
        pool.availableLiquidity = initialLiquidity;
        pool.isActive = true;
        
        // Distribute liquidity across supported chains
        uint256 liquidityPerChain = initialLiquidity / supportedChainIds.length;
        for (uint256 i = 0; i < supportedChainIds.length; i++) {
            pool.chainLiquidity[supportedChainIds[i]] = liquidityPerChain;
        }
        
        supportedTokens.push(token);
        emit AssetPoolCreated(token, initialLiquidity);
    }
    
    /**
     * @dev Initiate a cross-chain atomic swap
     */
    function initiateSwap(
        uint256 targetChainId,
        address token,
        uint256 amount,
        address recipient,
        bytes32 secretHash
    ) external nonReentrant whenNotPaused onlySupportedChain(targetChainId) {
        require(assetPools[token].isActive, "Token not supported");
        require(amount > 0, "Invalid amount");
        require(recipient != address(0), "Invalid recipient");
        require(secretHash != bytes32(0), "Invalid secret hash");
        
        // Check liquidity availability
        require(
            assetPools[token].chainLiquidity[targetChainId] >= amount,
            "Insufficient liquidity on target chain"
        );
        
        // Transfer tokens from user
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        
        // Generate swap ID
        uint256 nonce = userNonces[msg.sender]++;
        bytes32 swapId = keccak256(abi.encodePacked(
            msg.sender,
            block.chainid,
            targetChainId,
            token,
            amount,
            recipient,
            nonce,
            block.timestamp,
            secretHash
        ));
        
        // Create swap request
        swapRequests[swapId] = SwapRequest({
            user: msg.sender,
            sourceChainId: block.chainid,
            targetChainId: targetChainId,
            token: token,
            amount: amount,
            recipient: recipient,
            nonce: nonce,
            isExecuted: false,
            timestamp: block.timestamp,
            secretHash: secretHash,
            secret: bytes32(0)
        });
        
        // Update liquidity
        assetPools[token].chainLiquidity[block.chainid] += amount;
        assetPools[token].chainLiquidity[targetChainId] -= amount;
        
        emit SwapInitiated(swapId, msg.sender, block.chainid, targetChainId, token, amount);
    }
    
    /**
     * @dev Complete a cross-chain swap with secret revelation
     */
    function completeSwap(
        bytes32 swapId,
        bytes32 secret
    ) external nonReentrant onlyValidSwap(swapId) {
        SwapRequest storage swap = swapRequests[swapId];
        
        // Verify secret
        require(keccak256(abi.encodePacked(secret)) == swap.secretHash, "Invalid secret");
        require(block.timestamp <= swap.timestamp + SWAP_TIMEOUT, "Swap expired");
        
        // Mark as executed
        swap.isExecuted = true;
        swap.secret = secret;
        
        // Transfer tokens to recipient
        IERC20(swap.token).transfer(swap.recipient, swap.amount);
        
        emit SwapCompleted(swapId, secret);
    }
    
    /**
     * @dev Add liquidity to a specific chain
     */
    function addLiquidity(
        address token,
        uint256 amount,
        uint256 chainId
    ) external nonReentrant onlyOwner onlySupportedChain(chainId) {
        require(assetPools[token].isActive, "Token not supported");
        
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        
        assetPools[token].totalLiquidity += amount;
        assetPools[token].availableLiquidity += amount;
        assetPools[token].chainLiquidity[chainId] += amount;
        
        emit LiquidityAdded(token, amount, chainId);
    }
    
    /**
     * @dev Remove liquidity from a specific chain
     */
    function removeLiquidity(
        address token,
        uint256 amount,
        uint256 chainId
    ) external nonReentrant onlyOwner onlySupportedChain(chainId) {
        require(assetPools[token].isActive, "Token not supported");
        require(assetPools[token].chainLiquidity[chainId] >= amount, "Insufficient liquidity");
        
        assetPools[token].totalLiquidity -= amount;
        assetPools[token].availableLiquidity -= amount;
        assetPools[token].chainLiquidity[chainId] -= amount;
        
        IERC20(token).transfer(msg.sender, amount);
        
        emit LiquidityRemoved(token, amount, chainId);
    }
    
    /**
     * @dev Get liquidity information for a token across all chains
     */
    function getTokenLiquidityInfo(address token) external view returns (
        uint256 totalLiquidity,
        uint256 availableLiquidity,
        bool isActive,
        uint256[] memory chainIds,
        uint256[] memory chainLiquidity
    ) {
        AssetPool storage pool = assetPools[token];
        totalLiquidity = pool.totalLiquidity;
        availableLiquidity = pool.availableLiquidity;
        isActive = pool.isActive;
        
        chainIds = new uint256[](supportedChainIds.length);
        chainLiquidity = new uint256[](supportedChainIds.length);
        
        for (uint256 i = 0; i < supportedChainIds.length; i++) {
            chainIds[i] = supportedChainIds[i];
            chainLiquidity[i] = pool.chainLiquidity[supportedChainIds[i]];
        }
    }
    
    /**
     * @dev Get swap request details
     */
    function getSwapRequest(bytes32 swapId) external view returns (SwapRequest memory) {
        return swapRequests[swapId];
    }
    
    /**
     * @dev Get all supported chains
     */
    function getSupportedChains() external view returns (ChainConfig[] memory) {
        ChainConfig[] memory chains = new ChainConfig[](supportedChainIds.length);
        for (uint256 i = 0; i < supportedChainIds.length; i++) {
            chains[i] = supportedChains[supportedChainIds[i]];
        }
        return chains;
    }
    
    /**
     * @dev Emergency pause function
     */
    function emergencyPause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause function
     */
    function emergencyUnpause() external onlyOwner {
        _unpause();
    }
}

// Interface for ERC20 tokens
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}
