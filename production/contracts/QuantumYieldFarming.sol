// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./QuantumDeFiCore.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title QuantumYieldFarming
 * @dev AI-powered yield farming with dynamic reward mechanisms
 * @author Quantum DeFi Labs
 */
contract QuantumYieldFarming is ReentrancyGuard {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    // ============ STRUCTS ============
    
    struct Farm {
        address token;
        uint256 totalStaked;
        uint256 rewardPerToken;
        uint256 lastUpdateTime;
        uint256 rewardRate;
        uint256 duration;
        bool isActive;
        uint256 aiOptimizedRate;
        uint256 riskScore;
        uint256 volatilityIndex;
    }

    struct UserStake {
        uint256 amount;
        uint256 rewardDebt;
        uint256 lastClaimTime;
        uint256 lockPeriod;
        bool isLocked;
        uint256 aiOptimizationBonus;
    }

    struct AIOptimizationData {
        uint256 marketTrend;
        uint256 volatilityScore;
        uint256 riskAdjustedReturn;
        uint256 optimalStakeAmount;
        uint256 predictedYield;
        uint256 timestamp;
    }

    // ============ STATE VARIABLES ============
    
    QuantumDeFiCore public coreProtocol;
    
    mapping(address => Farm) public farms;
    mapping(address => mapping(address => UserStake)) public userStakes;
    mapping(address => AIOptimizationData) public aiOptimizations;
    
    address[] public farmTokens;
    uint256 public totalRewardsDistributed;
    uint256 public aiOptimizationThreshold;
    uint256 public riskFreeRate;
    address public owner;
    bool public paused;
    
    // AI and ML parameters
    uint256 public constant AI_UPDATE_INTERVAL = 1 hours;
    uint256 public constant MAX_VOLATILITY_INDEX = 100;
    uint256 public constant MIN_RISK_SCORE = 1;
    uint256 public constant MAX_RISK_SCORE = 100;
    
    // Events
    event FarmCreated(address indexed token, uint256 rewardRate, uint256 duration);
    event UserStaked(address indexed user, address indexed token, uint256 amount, uint256 lockPeriod);
    event UserUnstaked(address indexed user, address indexed token, uint256 amount);
    event RewardsClaimed(address indexed user, address indexed token, uint256 amount);
    event AIOptimizationUpdated(address indexed token, uint256 newRate, uint256 riskScore);
    event EmergencyWithdraw(address indexed user, address indexed token, uint256 amount);

    // ============ MODIFIERS ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    modifier onlyActiveFarm(address token) {
        require(farms[token].isActive, "Farm not active");
        _;
    }
    
    modifier onlyCoreProtocol() {
        require(msg.sender == address(coreProtocol), "Only core protocol");
        _;
    }

    // ============ CONSTRUCTOR ============
    
    constructor(address _coreProtocol) {
        owner = msg.sender;
        coreProtocol = QuantumDeFiCore(payable(_coreProtocol));
        aiOptimizationThreshold = 70; // 70% threshold for AI optimization
        riskFreeRate = 500; // 5% base rate (500 basis points)
    }

    // ============ CORE FARMING FUNCTIONS ============
    
    /**
     * @dev Create a new yield farming pool
     * @param token Token to farm
     * @param rewardRate Initial reward rate
     * @param duration Farming duration
     */
    function createFarm(
        address token,
        uint256 rewardRate,
        uint256 duration
    ) external onlyOwner {
        require(token != address(0), "Invalid token address");
        require(!farms[token].isActive, "Farm already exists");
        require(rewardRate > 0, "Invalid reward rate");
        require(duration > 0, "Invalid duration");
        
        farms[token] = Farm({
            token: token,
            totalStaked: 0,
            rewardPerToken: 0,
            lastUpdateTime: block.timestamp,
            rewardRate: rewardRate,
            duration: duration,
            isActive: true,
            aiOptimizedRate: rewardRate,
            riskScore: 50, // Default medium risk
            volatilityIndex: 25 // Default low volatility
        });
        
        farmTokens.push(token);
        
        emit FarmCreated(token, rewardRate, duration);
    }

    /**
     * @dev Stake tokens in a farm with AI-optimized parameters
     * @param token Token to stake
     * @param amount Amount to stake
     * @param lockPeriod Lock period for bonus rewards
     */
    function stake(
        address token,
        uint256 amount,
        uint256 lockPeriod
    ) external onlyActiveFarm(token) nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(lockPeriod <= 365 days, "Lock period too long");
        
        // Update farm rewards
        _updateFarmRewards(token);
        
        // Transfer tokens from user
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        
        // Calculate AI optimization bonus
        uint256 aiBonus = _calculateAIOptimizationBonus(token, amount);
        
        // Update user stake
        UserStake storage userStake = userStakes[msg.sender][token];
        userStake.amount = userStake.amount.add(amount);
        userStake.rewardDebt = userStake.rewardDebt.add(amount.mul(farms[token].rewardPerToken).div(1e18));
        userStake.lastClaimTime = block.timestamp;
        userStake.lockPeriod = lockPeriod;
        userStake.isLocked = lockPeriod > 0;
        userStake.aiOptimizationBonus = aiBonus;
        
        // Update farm totals
        farms[token].totalStaked = farms[token].totalStaked.add(amount);
        
        emit UserStaked(msg.sender, token, amount, lockPeriod);
    }

    /**
     * @dev Unstake tokens from a farm
     * @param token Token to unstake
     * @param amount Amount to unstake
     */
    function unstake(
        address token,
        uint256 amount
    ) external onlyActiveFarm(token) nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        UserStake storage userStake = userStakes[msg.sender][token];
        require(userStake.amount >= amount, "Insufficient staked amount");
        
        // Check lock period
        if (userStake.isLocked) {
            require(block.timestamp >= userStake.lastClaimTime.add(userStake.lockPeriod), "Tokens still locked");
        }
        
        // Update farm rewards
        _updateFarmRewards(token);
        
        // Calculate pending rewards
        uint256 pendingRewards = _calculatePendingRewards(msg.sender, token);
        
        // Update user stake
        userStake.amount = userStake.amount.sub(amount);
        userStake.rewardDebt = userStake.amount.mul(farms[token].rewardPerToken).div(1e18);
        
        // Update farm totals
        farms[token].totalStaked = farms[token].totalStaked.sub(amount);
        
        // Transfer tokens back to user
        IERC20(token).safeTransfer(msg.sender, amount);
        
        // Transfer pending rewards if any
        if (pendingRewards > 0) {
            _transferRewards(msg.sender, pendingRewards);
            emit RewardsClaimed(msg.sender, token, pendingRewards);
        }
        
        emit UserUnstaked(msg.sender, token, amount);
    }

    /**
     * @dev Claim rewards from a farm
     * @param token Token farm to claim from
     */
    function claimRewards(address token) external onlyActiveFarm(token) nonReentrant {
        _updateFarmRewards(token);
        
        uint256 pendingRewards = _calculatePendingRewards(msg.sender, token);
        require(pendingRewards > 0, "No rewards to claim");
        
        UserStake storage userStake = userStakes[msg.sender][token];
        userStake.rewardDebt = userStake.amount.mul(farms[token].rewardPerToken).div(1e18);
        userStake.lastClaimTime = block.timestamp;
        
        _transferRewards(msg.sender, pendingRewards);
        totalRewardsDistributed = totalRewardsDistributed.add(pendingRewards);
        
        emit RewardsClaimed(msg.sender, token, pendingRewards);
    }

    // ============ AI OPTIMIZATION FUNCTIONS ============
    
    /**
     * @dev Update AI optimization data for a farm
     * @param token Token address
     * @param marketTrend Market trend indicator
     * @param volatilityScore Volatility score
     * @param riskAdjustedReturn Risk-adjusted return
     * @param optimalStakeAmount Optimal stake amount
     * @param predictedYield Predicted yield
     */
    function updateAIOptimization(
        address token,
        uint256 marketTrend,
        uint256 volatilityScore,
        uint256 riskAdjustedReturn,
        uint256 optimalStakeAmount,
        uint256 predictedYield
    ) external onlyOwner {
        require(farms[token].isActive, "Farm not active");
        require(volatilityScore <= MAX_VOLATILITY_INDEX, "Invalid volatility score");
        require(riskAdjustedReturn >= riskFreeRate, "Return below risk-free rate");
        
        // Update AI optimization data
        aiOptimizations[token] = AIOptimizationData({
            marketTrend: marketTrend,
            volatilityScore: volatilityScore,
            riskAdjustedReturn: riskAdjustedReturn,
            optimalStakeAmount: optimalStakeAmount,
            predictedYield: predictedYield,
            timestamp: block.timestamp
        });
        
        // Update farm parameters based on AI optimization
        _applyAIOptimization(token);
        
        emit AIOptimizationUpdated(token, farms[token].aiOptimizedRate, farms[token].riskScore);
    }

    /**
     * @dev Apply AI optimization to farm parameters
     * @param token Token address
     */
    function _applyAIOptimization(address token) internal {
        Farm storage farm = farms[token];
        AIOptimizationData storage aiData = aiOptimizations[token];
        
        // Update risk score based on volatility
        farm.volatilityIndex = aiData.volatilityScore;
        farm.riskScore = _calculateRiskScore(aiData.volatilityScore, aiData.riskAdjustedReturn);
        
        // Adjust reward rate based on AI predictions
        if (aiData.predictedYield > farm.rewardRate) {
            farm.aiOptimizedRate = aiData.predictedYield;
        } else {
            // Reduce rate if market conditions worsen
            farm.aiOptimizedRate = farm.rewardRate.mul(90).div(100); // 10% reduction
        }
        
        // Update farm reward rate if AI optimization threshold is met
        if (farm.riskScore >= aiOptimizationThreshold) {
            farm.rewardRate = farm.aiOptimizedRate;
        }
    }

    /**
     * @dev Calculate risk score based on volatility and return
     * @param volatility Volatility score
     * @param returnRate Return rate
     * @return Risk score
     */
    function _calculateRiskScore(uint256 volatility, uint256 returnRate) internal view returns (uint256) {
        uint256 baseScore = 50; // Base medium risk
        
        // Adjust based on volatility (higher volatility = higher risk)
        uint256 volatilityAdjustment = volatility.mul(30).div(MAX_VOLATILITY_INDEX);
        
        // Adjust based on return (higher return = lower risk)
        uint256 returnAdjustment = returnRate > riskFreeRate ? 
            (returnRate.sub(riskFreeRate)).mul(20).div(1000) : 0;
        
        uint256 riskScore = baseScore.add(volatilityAdjustment).sub(returnAdjustment);
        
        // Ensure score is within bounds
        if (riskScore < MIN_RISK_SCORE) riskScore = MIN_RISK_SCORE;
        if (riskScore > MAX_RISK_SCORE) riskScore = MAX_RISK_SCORE;
        
        return riskScore;
    }

    /**
     * @dev Calculate AI optimization bonus for staking
     * @param token Token address
     * @param amount Stake amount
     * @return Bonus multiplier
     */
    function _calculateAIOptimizationBonus(address token, uint256 amount) internal view returns (uint256) {
        AIOptimizationData storage aiData = aiOptimizations[token];
        Farm storage farm = farms[token];
        
        if (aiData.timestamp == 0) return 0;
        
        // Bonus based on optimal stake amount
        uint256 optimalRatio = amount.mul(100).div(aiData.optimalStakeAmount);
        if (optimalRatio > 100) optimalRatio = 100;
        
        // Bonus based on risk score (lower risk = higher bonus)
        uint256 riskBonus = (MAX_RISK_SCORE.sub(farm.riskScore)).mul(20).div(MAX_RISK_SCORE);
        
        // Bonus based on market trend
        uint256 trendBonus = aiData.marketTrend > 50 ? 10 : 0;
        
        return optimalRatio.add(riskBonus).add(trendBonus);
    }

    // ============ INTERNAL FUNCTIONS ============
    
    /**
     * @dev Update farm rewards
     * @param token Token address
     */
    function _updateFarmRewards(address token) internal {
        Farm storage farm = farms[token];
        
        if (farm.totalStaked == 0) return;
        
        uint256 timeElapsed = block.timestamp.sub(farm.lastUpdateTime);
        if (timeElapsed == 0) return;
        
        uint256 rewards = farm.totalStaked.mul(farm.rewardRate).mul(timeElapsed).div(365 days).div(10000);
        farm.rewardPerToken = farm.rewardPerToken.add(rewards.mul(1e18).div(farm.totalStaked));
        farm.lastUpdateTime = block.timestamp;
    }

    /**
     * @dev Calculate pending rewards for a user
     * @param user User address
     * @param token Token address
     * @return Pending rewards
     */
    function _calculatePendingRewards(address user, address token) internal view returns (uint256) {
        UserStake storage userStake = userStakes[user][token];
        Farm storage farm = farms[token];
        
        if (userStake.amount == 0) return 0;
        
        uint256 currentRewardPerToken = farm.rewardPerToken;
        if (farm.totalStaked > 0) {
            uint256 timeElapsed = block.timestamp.sub(farm.lastUpdateTime);
            uint256 rewards = farm.totalStaked.mul(farm.rewardRate).mul(timeElapsed).div(365 days).div(10000);
            currentRewardPerToken = currentRewardPerToken.add(rewards.mul(1e18).div(farm.totalStaked));
        }
        
        uint256 pending = userStake.amount.mul(currentRewardPerToken).div(1e18).sub(userStake.rewardDebt);
        
        // Apply AI optimization bonus
        if (userStake.aiOptimizationBonus > 0) {
            pending = pending.add(pending.mul(userStake.aiOptimizationBonus).div(100));
        }
        
        return pending;
    }

    /**
     * @dev Transfer rewards to user
     * @param user User address
     * @param amount Reward amount
     */
    function _transferRewards(address user, uint256 amount) internal {
        // In this implementation, rewards are paid in ETH
        // In production, this could be any reward token
        payable(user).transfer(amount);
    }

    // ============ ADMIN FUNCTIONS ============
    
    /**
     * @dev Update AI optimization threshold
     * @param newThreshold New threshold value
     */
    function updateAIOptimizationThreshold(uint256 newThreshold) external onlyOwner {
        require(newThreshold <= 100, "Invalid threshold");
        aiOptimizationThreshold = newThreshold;
    }

    /**
     * @dev Update risk-free rate
     * @param newRate New risk-free rate
     */
    function updateRiskFreeRate(uint256 newRate) external onlyOwner {
        riskFreeRate = newRate;
    }

    /**
     * @dev Emergency withdraw function
     * @param token Token address
     */
    function emergencyWithdraw(address token) external {
        UserStake storage userStake = userStakes[msg.sender][token];
        require(userStake.amount > 0, "No tokens staked");
        
        uint256 amount = userStake.amount;
        userStake.amount = 0;
        userStake.rewardDebt = 0;
        
        farms[token].totalStaked = farms[token].totalStaked.sub(amount);
        
        IERC20(token).safeTransfer(msg.sender, amount);
        
        emit EmergencyWithdraw(msg.sender, token, amount);
    }

    /**
     * @dev Pause farming operations
     */
    function pause() external onlyOwner {
        paused = true;
    }

    /**
     * @dev Unpause farming operations
     */
    function unpause() external onlyOwner {
        paused = false;
    }

    // ============ VIEW FUNCTIONS ============
    
    /**
     * @dev Get user stake information
     * @param user User address
     * @param token Token address
     */
    function getUserStake(address user, address token) external view returns (
        uint256 amount,
        uint256 pendingRewards,
        uint256 lockPeriod,
        bool isLocked,
        uint256 aiBonus
    ) {
        UserStake storage userStake = userStakes[user][token];
        return (
            userStake.amount,
            _calculatePendingRewards(user, token),
            userStake.lockPeriod,
            userStake.isLocked,
            userStake.aiOptimizationBonus
        );
    }

    /**
     * @dev Get farm information
     * @param token Token address
     */
    function getFarmInfo(address token) external view returns (
        uint256 totalStaked,
        uint256 rewardRate,
        uint256 aiOptimizedRate,
        uint256 riskScore,
        uint256 volatilityIndex
    ) {
        Farm storage farm = farms[token];
        return (
            farm.totalStaked,
            farm.rewardRate,
            farm.aiOptimizedRate,
            farm.riskScore,
            farm.volatilityIndex
        );
    }

    /**
     * @dev Get AI optimization data
     * @param token Token address
     */
    function getAIOptimization(address token) external view returns (
        uint256 marketTrend,
        uint256 volatilityScore,
        uint256 riskAdjustedReturn,
        uint256 optimalStakeAmount,
        uint256 predictedYield,
        uint256 timestamp
    ) {
        AIOptimizationData storage aiData = aiOptimizations[token];
        return (
            aiData.marketTrend,
            aiData.volatilityScore,
            aiData.riskAdjustedReturn,
            aiData.optimalStakeAmount,
            aiData.predictedYield,
            aiData.timestamp
        );
    }

    /**
     * @dev Get all farm tokens
     * @return Array of farm token addresses
     */
    function getFarmTokens() external view returns (address[] memory) {
        return farmTokens;
    }

    // ============ FALLBACK FUNCTIONS ============
    
    receive() external payable {
        // Accept ETH for rewards
    }

    fallback() external payable {
        // Fallback function
    }
}
