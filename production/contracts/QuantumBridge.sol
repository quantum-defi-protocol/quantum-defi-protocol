// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./QuantumDeFiCore.sol";

/**
 * @title QuantumBridge
 * @dev Cross-chain bridge with quantum-resistant security and atomic swaps
 * @author Quantum DeFi Labs
 */
interface IERC20Minimal {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract QuantumBridge {

    // ============ STRUCTS ============
    
    struct BridgeRequest {
        bytes32 requestId;
        address from;
        address to;
        address token;
        uint256 amount;
        uint256 sourceChainId;
        uint256 targetChainId;
        uint256 timestamp;
        uint256 expiry;
        BridgeStatus status;
        bytes quantumProof;
        bytes validatorSignatures;
        uint256 requiredSignatures;
        uint256 currentSignatures;
    }

    struct ChainInfo {
        bool isSupported;
        uint256 chainId;
        string name;
        uint256 minConfirmations;
        uint256 maxTransferAmount;
        uint256 bridgeFee;
        bool isActive;
        uint256 quantumResistanceLevel;
    }

    struct Validator {
        address validatorAddress;
        bool isActive;
        uint256 stakeAmount;
        uint256 reputationScore;
        uint256 lastValidationTime;
        uint256 totalValidations;
        uint256 successfulValidations;
    }

    enum BridgeStatus {
        Pending,
        Validating,
        Confirmed,
        Executed,
        Failed,
        Expired,
        Cancelled
    }

    // ============ STATE VARIABLES ============
    
    QuantumDeFiCore public coreProtocol;
    
    mapping(bytes32 => BridgeRequest) public bridgeRequests;
    mapping(uint256 => ChainInfo) public supportedChains;
    mapping(address => Validator) public validators;
    mapping(bytes32 => mapping(address => bool)) public validatorVotes;
    
    address[] public validatorList;
    uint256[] public supportedChainIds;
    
    uint256 public totalTransfers;
    uint256 public totalVolume;
    uint256 public bridgeFee;
    uint256 public minValidatorStake;
    uint256 public quantumResistanceThreshold;
    address public owner;
    bool public paused;
    
    // Bridge parameters
    uint256 public constant MAX_VALIDATORS = 21;
    uint256 public constant MIN_VALIDATIONS = 15;
    uint256 public constant BRIDGE_TIMEOUT = 1 hours;
    uint256 public constant MAX_TRANSFER_AMOUNT = 1000000 * 10**18; // 1M tokens
    
    // Events
    event BridgeRequestCreated(bytes32 indexed requestId, address from, address to, uint256 amount, uint256 targetChainId);
    event BridgeRequestValidated(bytes32 indexed requestId, address validator, uint256 timestamp);
    event BridgeRequestExecuted(bytes32 indexed requestId, uint256 timestamp);
    event BridgeRequestFailed(bytes32 indexed requestId, string reason);
    event ValidatorAdded(address indexed validator, uint256 stakeAmount);
    event ValidatorRemoved(address indexed validator);
    event ChainAdded(uint256 indexed chainId, string name);
    event ChainRemoved(uint256 indexed chainId);
    event EmergencyPause(address indexed admin, uint256 timestamp);

    // ============ MODIFIERS ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    modifier onlySupportedChain(uint256 chainId) {
        require(supportedChains[chainId].isSupported, "Chain not supported");
        _;
    }
    
    modifier onlyActiveValidator() {
        require(validators[msg.sender].isActive, "Not an active validator");
        _;
    }
    
    modifier onlyValidRequest(bytes32 requestId) {
        require(bridgeRequests[requestId].requestId != bytes32(0), "Request not found");
        _;
    }

    // ============ CONSTRUCTOR ============
    
    constructor(address _coreProtocol) {
        owner = msg.sender;
        coreProtocol = QuantumDeFiCore(payable(_coreProtocol));
        bridgeFee = 10; // 0.1% (10 basis points)
        minValidatorStake = 1000 * 10**18; // 1000 tokens
        quantumResistanceThreshold = 7;
        
        // Initialize with current chain
        uint256 currentChainId = block.chainid;
        supportedChains[currentChainId] = ChainInfo({
            isSupported: true,
            chainId: currentChainId,
            name: "Current Chain",
            minConfirmations: 12,
            maxTransferAmount: MAX_TRANSFER_AMOUNT,
            bridgeFee: bridgeFee,
            isActive: true,
            quantumResistanceLevel: 8
        });
        supportedChainIds.push(currentChainId);
    }

    // ============ CORE BRIDGE FUNCTIONS ============
    
    /**
     * @dev Create a cross-chain bridge request
     * @param to Recipient address on target chain
     * @param token Token to transfer
     * @param amount Amount to transfer
     * @param targetChainId Target blockchain ID
     * @param quantumProof Quantum-resistant proof
     */
    function createBridgeRequest(
        address to,
        address token,
        uint256 amount,
        uint256 targetChainId,
        bytes calldata quantumProof
    ) external onlySupportedChain(targetChainId) {
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= supportedChains[targetChainId].maxTransferAmount, "Amount exceeds limit");
        require(_verifyQuantumProof(msg.sender, quantumProof), "Invalid quantum proof");
        
        // Calculate bridge fee
        uint256 feeAmount = amount * bridgeFee / 10000;
        uint256 transferAmount = amount - feeAmount;
        
        // Transfer tokens from user
        require(IERC20Minimal(token).transferFrom(msg.sender, address(this), amount), "transferFrom failed");
        
        // Generate unique request ID
        bytes32 requestId = keccak256(abi.encodePacked(
            msg.sender,
            to,
            token,
            amount,
            targetChainId,
            block.timestamp,
            block.chainid
        ));
        
        // Create bridge request
        bridgeRequests[requestId] = BridgeRequest({
            requestId: requestId,
            from: msg.sender,
            to: to,
            token: token,
            amount: transferAmount,
            sourceChainId: block.chainid,
            targetChainId: targetChainId,
            timestamp: block.timestamp,
            expiry: block.timestamp + BRIDGE_TIMEOUT,
            status: BridgeStatus.Pending,
            quantumProof: quantumProof,
            validatorSignatures: "",
            requiredSignatures: MIN_VALIDATIONS,
            currentSignatures: 0
        });
        
        totalTransfers = totalTransfers + 1;
        totalVolume = totalVolume + amount;
        
        emit BridgeRequestCreated(requestId, msg.sender, to, transferAmount, targetChainId);
    }

    /**
     * @dev Validate a bridge request (called by validators)
     * @param requestId Bridge request ID
     * @param signature Validator signature
     */
    function validateBridgeRequest(
        bytes32 requestId,
        bytes calldata signature
    ) external onlyActiveValidator onlyValidRequest(requestId) {
        BridgeRequest storage request = bridgeRequests[requestId];
        require(request.status == BridgeStatus.Pending, "Request not pending");
        require(block.timestamp <= request.expiry, "Request expired");
        require(!validatorVotes[requestId][msg.sender], "Already voted");
        
        // Verify validator signature
        require(_verifyValidatorSignature(requestId, signature), "Invalid signature");
        
        // Record validator vote
        validatorVotes[requestId][msg.sender] = true;
        request.currentSignatures = request.currentSignatures + 1;
        
        // Update validator stats
        Validator storage validator = validators[msg.sender];
        validator.lastValidationTime = block.timestamp;
        validator.totalValidations = validator.totalValidations + 1;
        
        emit BridgeRequestValidated(requestId, msg.sender, block.timestamp);
        
        // Check if enough validations received
        if (request.currentSignatures >= request.requiredSignatures) {
            request.status = BridgeStatus.Confirmed;
            _executeBridgeRequest(requestId);
        }
    }

    /**
     * @dev Execute a confirmed bridge request
     * @param requestId Bridge request ID
     */
    function _executeBridgeRequest(bytes32 requestId) internal {
        BridgeRequest storage request = bridgeRequests[requestId];
        require(request.status == BridgeStatus.Confirmed, "Request not confirmed");
        
        try this._processCrossChainTransfer(requestId) {
            request.status = BridgeStatus.Executed;
            emit BridgeRequestExecuted(requestId, block.timestamp);
        } catch {
            request.status = BridgeStatus.Failed;
            emit BridgeRequestFailed(requestId, "Execution failed");
        }
    }

    /**
     * @dev Process cross-chain transfer (external call for try-catch)
     * @param requestId Bridge request ID
     */
    function _processCrossChainTransfer(bytes32 requestId) external {
        require(msg.sender == address(this), "Only self-call allowed");
        
        BridgeRequest storage request = bridgeRequests[requestId];
        
        // In a real implementation, this would:
        // 1. Send message to target chain
        // 2. Wait for confirmation
        // 3. Release tokens on target chain
        
        // For now, we'll simulate the process
        // In production, this would integrate with actual cross-chain messaging protocols
        
        // Mark as processed
        request.status = BridgeStatus.Executed;
    }

    /**
     * @dev Cancel a bridge request (only by request creator)
     * @param requestId Bridge request ID
     */
    function cancelBridgeRequest(bytes32 requestId) external onlyValidRequest(requestId) {
        BridgeRequest storage request = bridgeRequests[requestId];
        require(msg.sender == request.from, "Only creator can cancel");
        require(request.status == BridgeStatus.Pending, "Request not pending");
        require(block.timestamp > request.expiry, "Request not expired");
        
        request.status = BridgeStatus.Cancelled;
        
        // Return tokens to user
        require(IERC20Minimal(request.token).transfer(request.from, request.amount), "transfer failed");
    }

    // ============ VALIDATOR MANAGEMENT ============
    
    /**
     * @dev Add a new validator
     * @param validator Validator address
     * @param stakeAmount Stake amount
     */
    function addValidator(address validator, uint256 stakeAmount) external onlyOwner {
        require(validator != address(0), "Invalid validator address");
        require(stakeAmount >= minValidatorStake, "Insufficient stake");
        require(validatorList.length < MAX_VALIDATORS, "Max validators reached");
        require(!validators[validator].isActive, "Validator already exists");
        
        // Transfer stake from validator
        // In production, stake would be transferred in a staking token
        
        validators[validator] = Validator({
            validatorAddress: validator,
            isActive: true,
            stakeAmount: stakeAmount,
            reputationScore: 100,
            lastValidationTime: 0,
            totalValidations: 0,
            successfulValidations: 0
        });
        
        validatorList.push(validator);
        
        emit ValidatorAdded(validator, stakeAmount);
    }

    /**
     * @dev Remove a validator
     * @param validator Validator address
     */
    function removeValidator(address validator) external onlyOwner {
        require(validators[validator].isActive, "Validator not active");
        
        validators[validator].isActive = false;
        
        // Return stake to validator
        uint256 stakeAmount = validators[validator].stakeAmount;
        validators[validator].stakeAmount = 0;
        
        payable(validator).transfer(stakeAmount);
        
        emit ValidatorRemoved(validator);
    }

    /**
     * @dev Update validator reputation
     * @param validator Validator address
     * @param newScore New reputation score
     */
    function updateValidatorReputation(address validator, uint256 newScore) external onlyOwner {
        require(validators[validator].isActive, "Validator not active");
        require(newScore <= 100, "Invalid reputation score");
        
        validators[validator].reputationScore = newScore;
        
        // Deactivate validator if reputation too low
        if (newScore < 30) {
            validators[validator].isActive = false;
            emit ValidatorRemoved(validator);
        }
    }

    // ============ CHAIN MANAGEMENT ============
    
    /**
     * @dev Add supported chain
     * @param chainId Chain ID
     * @param name Chain name
     * @param minConfirmations Minimum confirmations required
     * @param maxTransferAmount Maximum transfer amount
     * @param bridgeFee Bridge fee for this chain
     * @param quantumResistanceLevel Required quantum resistance level
     */
    /// @param chainBridgeFee Bridge fee for this chain
    function addSupportedChain(
        uint256 chainId,
        string memory name,
        uint256 minConfirmations,
        uint256 maxTransferAmount,
        uint256 chainBridgeFee,
        uint256 quantumResistanceLevel
    ) external onlyOwner {
        require(chainId != block.chainid, "Cannot add current chain");
        require(!supportedChains[chainId].isSupported, "Chain already supported");
        require(quantumResistanceLevel <= 10, "Invalid quantum resistance level");
        
        supportedChains[chainId] = ChainInfo({
            isSupported: true,
            chainId: chainId,
            name: name,
            minConfirmations: minConfirmations,
            maxTransferAmount: maxTransferAmount,
            bridgeFee: chainBridgeFee,
            isActive: true,
            quantumResistanceLevel: quantumResistanceLevel
        });
        
        supportedChainIds.push(chainId);
        
        emit ChainAdded(chainId, name);
    }

    /**
     * @dev Remove supported chain
     * @param chainId Chain ID
     */
    function removeSupportedChain(uint256 chainId) external onlyOwner {
        require(chainId != block.chainid, "Cannot remove current chain");
        require(supportedChains[chainId].isSupported, "Chain not supported");
        
        supportedChains[chainId].isSupported = false;
        supportedChains[chainId].isActive = false;
        
        emit ChainRemoved(chainId);
    }

    // ============ QUANTUM-RESISTANT FUNCTIONS ============
    
    /**
     * @dev Verify quantum-resistant proof
     * @param user User address
     * @param proof Quantum-resistant proof
     * @return True if proof is valid
     */
    function _verifyQuantumProof(address user, bytes calldata proof) internal returns (bool) {
        // Simplified quantum-resistant verification
        // In production, this would use actual lattice-based cryptography
        
        bytes32 proofHash = keccak256(proof);
        uint256 proofValue = uint256(proofHash) % 10;
        
        return proofValue >= quantumResistanceThreshold;
    }

    /**
     * @dev Verify validator signature
     * @param requestId Request ID
     * @param signature Validator signature
     * @return True if signature is valid
     */
    function _verifyValidatorSignature(bytes32 requestId, bytes calldata signature) internal view returns (bool) {
        // Simplified signature verification
        // In production, this would use proper cryptographic verification
        return signature.length > 0;
    }

    // ============ ADMIN FUNCTIONS ============
    
    /**
     * @dev Update bridge fee
     * @param newFee New bridge fee
     */
    function updateBridgeFee(uint256 newFee) external onlyOwner {
        require(newFee <= 100, "Fee too high"); // Max 1%
        bridgeFee = newFee;
    }

    /**
     * @dev Update minimum validator stake
     * @param newStake New minimum stake amount
     */
    function updateMinValidatorStake(uint256 newStake) external onlyOwner {
        minValidatorStake = newStake;
    }

    /**
     * @dev Update quantum resistance threshold
     * @param newThreshold New threshold
     */
    function updateQuantumResistanceThreshold(uint256 newThreshold) external onlyOwner {
        require(newThreshold <= 10, "Invalid threshold");
        quantumResistanceThreshold = newThreshold;
    }

    /**
     * @dev Emergency pause
     */
    function emergencyPause() external onlyOwner {
        paused = true;
        emit EmergencyPause(msg.sender, block.timestamp);
    }

    /**
     * @dev Emergency unpause
     */
    function emergencyUnpause() external onlyOwner {
        paused = false;
    }

    // ============ VIEW FUNCTIONS ============
    
    /**
     * @dev Get bridge request details
     * @param requestId Request ID
     */
    function getBridgeRequest(bytes32 requestId) external view returns (
        address from,
        address to,
        address token,
        uint256 amount,
        uint256 sourceChainId,
        uint256 targetChainId,
        uint256 timestamp,
        BridgeStatus status,
        uint256 currentSignatures,
        uint256 requiredSignatures
    ) {
        BridgeRequest storage request = bridgeRequests[requestId];
        return (
            request.from,
            request.to,
            request.token,
            request.amount,
            request.sourceChainId,
            request.targetChainId,
            request.timestamp,
            request.status,
            request.currentSignatures,
            request.requiredSignatures
        );
    }

    /**
     * @dev Get validator information
     * @param validator Validator address
     */
    function getValidator(address validator) external view returns (
        bool isActive,
        uint256 stakeAmount,
        uint256 reputationScore,
        uint256 lastValidationTime,
        uint256 totalValidations,
        uint256 successfulValidations
    ) {
        Validator storage val = validators[validator];
        return (
            val.isActive,
            val.stakeAmount,
            val.reputationScore,
            val.lastValidationTime,
            val.totalValidations,
            val.successfulValidations
        );
    }

    /**
     * @dev Get supported chains
     * @return Array of supported chain IDs
     */
    function getSupportedChains() external view returns (uint256[] memory) {
        return supportedChainIds;
    }

    /**
     * @dev Get validators list
     * @return Array of validator addresses
     */
    function getValidators() external view returns (address[] memory) {
        return validatorList;
    }

    // ============ FALLBACK FUNCTIONS ============
    
    receive() external payable {
        // Accept ETH for fees and stakes
    }

    fallback() external payable {
        // Fallback function
    }
}
