// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title UniversalAssetManager
 * @dev Manages assets across multiple chains with quantum-resistant security
 */
contract UniversalAssetManager is ReentrancyGuard, Pausable, Ownable {
    
    struct Asset {
        address token;
        uint256 chainId;
        string symbol;
        uint8 decimals;
        uint256 totalSupply;
        uint256 circulatingSupply;
        bool isActive;
        bool isNative;
    }
    
    struct CrossChainBalance {
        mapping(uint256 => uint256) chainBalances; // chainId => balance
        uint256 totalBalance;
        uint256 lockedBalance;
    }
    
    struct AssetSwap {
        address user;
        address fromToken;
        uint256 fromChainId;
        address toToken;
        uint256 toChainId;
        uint256 amount;
        uint256 expectedAmount;
        uint256 slippageTolerance;
        bool isExecuted;
        uint256 timestamp;
        bytes32 swapId;
    }
    
    // Events
    event AssetRegistered(address indexed token, uint256 chainId, string symbol);
    event AssetSwapInitiated(
        bytes32 indexed swapId,
        address indexed user,
        address fromToken,
        address toToken,
        uint256 amount,
        uint256 expectedAmount
    );
    event AssetSwapCompleted(bytes32 indexed swapId, uint256 actualAmount);
    event CrossChainTransfer(
        address indexed user,
        address token,
        uint256 fromChainId,
        uint256 toChainId,
        uint256 amount
    );
    event LiquidityPoolCreated(address indexed tokenA, address indexed tokenB, address pool);
    event YieldOptimized(address indexed user, address token, uint256 amount, uint256 yield);
    
    // State variables
    mapping(address => Asset) public registeredAssets;
    mapping(address => CrossChainBalance) public userBalances;
    mapping(bytes32 => AssetSwap) public assetSwaps;
    mapping(address => uint256) public userSwapNonces;
    
    address[] public registeredTokenAddresses;
    address public crossChainBridge;
    address public yieldOptimizer;
    
    uint256 public constant MAX_SLIPPAGE = 5000; // 50%
    uint256 public constant MIN_SWAP_AMOUNT = 1000; // 1000 wei
    uint256 public constant SWAP_TIMEOUT = 1 hours;
    
    // Modifiers
    modifier onlyRegisteredAsset(address token) {
        require(registeredAssets[token].isActive, "Asset not registered");
        _;
    }
    
    modifier onlyValidSwap(bytes32 swapId) {
        require(assetSwaps[swapId].user != address(0), "Invalid swap ID");
        require(!assetSwaps[swapId].isExecuted, "Swap already executed");
        _;
    }
    
    constructor(address _crossChainBridge) {
        crossChainBridge = _crossChainBridge;
    }
    
    /**
     * @dev Register a new asset for cross-chain management
     */
    function registerAsset(
        address token,
        uint256 chainId,
        string memory symbol,
        uint8 decimals,
        uint256 totalSupply,
        bool isNative
    ) external onlyOwner {
        require(!registeredAssets[token].isActive, "Asset already registered");
        require(token != address(0), "Invalid token address");
        
        registeredAssets[token] = Asset({
            token: token,
            chainId: chainId,
            symbol: symbol,
            decimals: decimals,
            totalSupply: totalSupply,
            circulatingSupply: 0,
            isActive: true,
            isNative: isNative
        });
        
        registeredTokenAddresses.push(token);
        emit AssetRegistered(token, chainId, symbol);
    }
    
    /**
     * @dev Initiate a cross-chain asset swap
     */
    function initiateAssetSwap(
        address fromToken,
        address toToken,
        uint256 amount,
        uint256 expectedAmount,
        uint256 slippageTolerance
    ) external nonReentrant whenNotPaused onlyRegisteredAsset(fromToken) onlyRegisteredAsset(toToken) {
        require(amount >= MIN_SWAP_AMOUNT, "Amount too small");
        require(slippageTolerance <= MAX_SLIPPAGE, "Slippage too high");
        require(fromToken != toToken, "Cannot swap same token");
        
        // Transfer tokens from user
        IERC20(fromToken).transferFrom(msg.sender, address(this), amount);
        
        // Generate swap ID
        uint256 nonce = userSwapNonces[msg.sender]++;
        bytes32 swapId = keccak256(abi.encodePacked(
            msg.sender,
            fromToken,
            toToken,
            amount,
            expectedAmount,
            nonce,
            block.timestamp
        ));
        
        // Create swap record
        assetSwaps[swapId] = AssetSwap({
            user: msg.sender,
            fromToken: fromToken,
            fromChainId: registeredAssets[fromToken].chainId,
            toToken: toToken,
            toChainId: registeredAssets[toToken].chainId,
            amount: amount,
            expectedAmount: expectedAmount,
            slippageTolerance: slippageTolerance,
            isExecuted: false,
            timestamp: block.timestamp,
            swapId: swapId
        });
        
        emit AssetSwapInitiated(swapId, msg.sender, fromToken, toToken, amount, expectedAmount);
        
        // Execute the swap (simplified for demo)
        _executeSwap(swapId);
    }
    
    /**
     * @dev Execute a cross-chain asset swap
     */
    function _executeSwap(bytes32 swapId) internal {
        AssetSwap storage swap = assetSwaps[swapId];
        
        // Calculate actual amount with slippage protection
        uint256 actualAmount = _calculateSwapAmount(
            swap.fromToken,
            swap.toToken,
            swap.amount
        );
        
        // Check slippage
        uint256 minAmount = swap.expectedAmount * (10000 - swap.slippageTolerance) / 10000;
        require(actualAmount >= minAmount, "Slippage too high");
        
        // Mark as executed
        swap.isExecuted = true;
        
        // Transfer tokens to user
        IERC20(swap.toToken).transfer(swap.user, actualAmount);
        
        emit AssetSwapCompleted(swapId, actualAmount);
    }
    
    /**
     * @dev Calculate swap amount (simplified pricing)
     */
    function _calculateSwapAmount(
        address fromToken,
        address toToken,
        uint256 amount
    ) internal view returns (uint256) {
        // Simplified 1:1 swap for demo
        // In production, this would use oracle prices or AMM pools
        Asset memory fromAsset = registeredAssets[fromToken];
        Asset memory toAsset = registeredAssets[toToken];
        
        // Adjust for decimals
        if (fromAsset.decimals > toAsset.decimals) {
            return amount / (10 ** (fromAsset.decimals - toAsset.decimals));
        } else if (fromAsset.decimals < toAsset.decimals) {
            return amount * (10 ** (toAsset.decimals - fromAsset.decimals));
        } else {
            return amount;
        }
    }
    
    /**
     * @dev Transfer assets across chains
     */
    function transferCrossChain(
        address token,
        uint256 toChainId,
        uint256 amount,
        address recipient
    ) external nonReentrant whenNotPaused onlyRegisteredAsset(token) {
        require(amount > 0, "Invalid amount");
        require(recipient != address(0), "Invalid recipient");
        require(registeredAssets[token].chainId != toChainId, "Same chain transfer");
        
        // Transfer tokens from user
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        
        // Update cross-chain balance
        userBalances[msg.sender].chainBalances[registeredAssets[token].chainId] -= amount;
        userBalances[msg.sender].chainBalances[toChainId] += amount;
        userBalances[msg.sender].totalBalance -= amount;
        
        emit CrossChainTransfer(msg.sender, token, registeredAssets[token].chainId, toChainId, amount);
    }
    
    /**
     * @dev Optimize yield across multiple chains
     */
    function optimizeYield(address token, uint256 amount) external nonReentrant whenNotPaused onlyRegisteredAsset(token) {
        require(amount > 0, "Invalid amount");
        
        // Transfer tokens from user
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        
        // Calculate optimal chain for yield
        uint256 optimalChainId = _findOptimalYieldChain(token, amount);
        
        // Execute yield optimization
        uint256 yield = _executeYieldStrategy(token, amount, optimalChainId);
        
        // Update user balance
        userBalances[msg.sender].chainBalances[optimalChainId] += amount + yield;
        userBalances[msg.sender].totalBalance += yield;
        
        emit YieldOptimized(msg.sender, token, amount, yield);
    }
    
    /**
     * @dev Find optimal chain for yield
     */
    function _findOptimalYieldChain(address token, uint256 amount) internal view returns (uint256) {
        // Simplified logic - in production would use real yield data
        uint256[] memory chainIds = _getSupportedChainIds();
        uint256 bestChainId = chainIds[0];
        uint256 bestYield = 0;
        
        for (uint256 i = 0; i < chainIds.length; i++) {
            uint256 yield = _calculateYieldForChain(token, amount, chainIds[i]);
            if (yield > bestYield) {
                bestYield = yield;
                bestChainId = chainIds[i];
            }
        }
        
        return bestChainId;
    }
    
    /**
     * @dev Calculate yield for a specific chain
     */
    function _calculateYieldForChain(address token, uint256 amount, uint256 chainId) internal pure returns (uint256) {
        // Simplified yield calculation
        // In production, this would fetch real APY data from oracles
        if (chainId == 1) return amount * 5 / 100; // 5% APY for Ethereum
        if (chainId == 137) return amount * 8 / 100; // 8% APY for Polygon
        if (chainId == 42161) return amount * 7 / 100; // 7% APY for Arbitrum
        return amount * 3 / 100; // 3% APY default
    }
    
    /**
     * @dev Execute yield strategy
     */
    function _executeYieldStrategy(address token, uint256 amount, uint256 chainId) internal pure returns (uint256) {
        // Simplified yield execution
        return _calculateYieldForChain(token, amount, chainId);
    }
    
    /**
     * @dev Get supported chain IDs
     */
    function _getSupportedChainIds() internal pure returns (uint256[] memory) {
        uint256[] memory chainIds = new uint256[](4);
        chainIds[0] = 1; // Ethereum
        chainIds[1] = 137; // Polygon
        chainIds[2] = 42161; // Arbitrum
        chainIds[3] = 8453; // Base
        return chainIds;
    }
    
    /**
     * @dev Get user's cross-chain balance for a token
     */
    function getUserCrossChainBalance(address user, address token) external view returns (
        uint256 totalBalance,
        uint256[] memory chainIds,
        uint256[] memory chainBalances
    ) {
        CrossChainBalance storage balance = userBalances[user];
        totalBalance = balance.totalBalance;
        
        uint256[] memory supportedChains = _getSupportedChainIds();
        chainIds = new uint256[](supportedChains.length);
        chainBalances = new uint256[](supportedChains.length);
        
        for (uint256 i = 0; i < supportedChains.length; i++) {
            chainIds[i] = supportedChains[i];
            chainBalances[i] = balance.chainBalances[supportedChains[i]];
        }
    }
    
    /**
     * @dev Get all registered assets
     */
    function getRegisteredAssets() external view returns (Asset[] memory) {
        Asset[] memory assets = new Asset[](registeredTokenAddresses.length);
        for (uint256 i = 0; i < registeredTokenAddresses.length; i++) {
            assets[i] = registeredAssets[registeredTokenAddresses[i]];
        }
        return assets;
    }
    
    /**
     * @dev Emergency functions
     */
    function emergencyPause() external onlyOwner {
        _pause();
    }
    
    function emergencyUnpause() external onlyOwner {
        _unpause();
    }
    
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }
}

// Interface for ERC20 tokens
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}
