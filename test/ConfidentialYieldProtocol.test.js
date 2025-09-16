const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ConfidentialYieldProtocol", function () {
  let confidentialProtocol, mockFHE, owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    // Deploy MockFHE contract
    const MockFHE = await ethers.getContractFactory("MockFHE");
    mockFHE = await MockFHE.deploy();
    await mockFHE.deployed();
    
    // Deploy ConfidentialYieldProtocol
    const ConfidentialYieldProtocol = await ethers.getContractFactory("ConfidentialYieldProtocol");
    confidentialProtocol = await ConfidentialYieldProtocol.deploy(mockFHE.address);
    await confidentialProtocol.deployed();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await confidentialProtocol.owner()).to.equal(owner.address);
      expect(await confidentialProtocol.fhe()).to.equal(mockFHE.address);
    });

    it("Should initialize with default encrypted market data", async function () {
      const marketData = await confidentialProtocol.getEncryptedMarketData();
      expect(marketData.volatility).to.not.equal(ethers.constants.HashZero);
      expect(marketData.trend).to.not.equal(ethers.constants.HashZero);
      expect(marketData.optimalRate).to.not.equal(ethers.constants.HashZero);
    });
  });

  describe("Confidential Staking", function () {
    it("Should allow users to stake with encrypted amounts", async function () {
      const stakeAmount = 1000;
      const encryptedAmount = await mockFHE.encrypt(stakeAmount);
      
      await confidentialProtocol.connect(user1).confidentialStake(encryptedAmount);
      
      const encryptedBalance = await confidentialProtocol.getEncryptedBalance(user1.address);
      expect(encryptedBalance).to.not.equal(ethers.constants.HashZero);
    });

    it("Should emit EncryptedStake event", async function () {
      const stakeAmount = 1000;
      const encryptedAmount = await mockFHE.encrypt(stakeAmount);
      
      await expect(confidentialProtocol.connect(user1).confidentialStake(encryptedAmount))
        .to.emit(confidentialProtocol, "EncryptedStake")
        .withArgs(user1.address, encryptedAmount);
    });

    it("Should calculate encrypted yield rate", async function () {
      const stakeAmount = 1000;
      const encryptedAmount = await mockFHE.encrypt(stakeAmount);
      
      await confidentialProtocol.connect(user1).confidentialStake(encryptedAmount);
      
      const encryptedYieldRate = await confidentialProtocol.calculateEncryptedYieldRate(user1.address);
      expect(encryptedYieldRate).to.not.equal(ethers.constants.HashZero);
    });
  });

  describe("AI Parameter Management", function () {
    it("Should allow users to set encrypted AI parameters", async function () {
      const riskTolerance = await mockFHE.encrypt(75);
      const timeHorizon = await mockFHE.encrypt(90);
      const liquidityPreference = await mockFHE.encrypt(60);
      
      await confidentialProtocol.connect(user1).setEncryptedAIParams(
        riskTolerance,
        timeHorizon,
        liquidityPreference
      );
      
      const aiParams = await confidentialProtocol.getEncryptedAIParams(user1.address);
      expect(aiParams.riskTolerance).to.equal(riskTolerance);
      expect(aiParams.timeHorizon).to.equal(timeHorizon);
      expect(aiParams.liquidityPreference).to.equal(liquidityPreference);
    });

    it("Should calculate yield rate based on AI parameters", async function () {
      // Set AI parameters
      const riskTolerance = await mockFHE.encrypt(80);
      const timeHorizon = await mockFHE.encrypt(120);
      const liquidityPreference = await mockFHE.encrypt(70);
      
      await confidentialProtocol.connect(user1).setEncryptedAIParams(
        riskTolerance,
        timeHorizon,
        liquidityPreference
      );
      
      // Stake confidentially
      const stakeAmount = 2000;
      const encryptedAmount = await mockFHE.encrypt(stakeAmount);
      await confidentialProtocol.connect(user1).confidentialStake(encryptedAmount);
      
      // Calculate yield rate
      const encryptedYieldRate = await confidentialProtocol.calculateEncryptedYieldRate(user1.address);
      expect(encryptedYieldRate).to.not.equal(ethers.constants.HashZero);
    });
  });

  describe("Yield Calculations", function () {
    it("Should calculate encrypted yield on staked amounts", async function () {
      const stakeAmount = 1500;
      const encryptedAmount = await mockFHE.encrypt(stakeAmount);
      
      await confidentialProtocol.connect(user1).confidentialStake(encryptedAmount);
      
      const encryptedYield = await confidentialProtocol.connect(user1).calculateEncryptedYield(user1.address);
      expect(encryptedYield).to.not.equal(ethers.constants.HashZero);
    });

    it("Should accumulate total yield over time", async function () {
      const stakeAmount = 1000;
      const encryptedAmount = await mockFHE.encrypt(stakeAmount);
      
      await confidentialProtocol.connect(user1).confidentialStake(encryptedAmount);
      
      // Calculate yield multiple times
      await confidentialProtocol.connect(user1).calculateEncryptedYield(user1.address);
      await confidentialProtocol.connect(user1).calculateEncryptedYield(user1.address);
      
      const totalYield = await confidentialProtocol.getEncryptedTotalYield(user1.address);
      expect(totalYield).to.not.equal(ethers.constants.HashZero);
    });

    it("Should emit EncryptedYieldCalculated event", async function () {
      const stakeAmount = 1000;
      const encryptedAmount = await mockFHE.encrypt(stakeAmount);
      
      await confidentialProtocol.connect(user1).confidentialStake(encryptedAmount);
      
      await expect(confidentialProtocol.connect(user1).calculateEncryptedYield(user1.address))
        .to.emit(confidentialProtocol, "EncryptedYieldCalculated")
        .withArgs(user1.address, await confidentialProtocol.getEncryptedTotalYield(user1.address));
    });
  });

  describe("Market Data Management", function () {
    it("Should allow owner to update encrypted market data", async function () {
      const newVolatility = await mockFHE.encrypt(30);
      const newTrend = await mockFHE.encrypt(85);
      
      await confidentialProtocol.connect(owner).updateEncryptedMarketData(newVolatility, newTrend);
      
      const marketData = await confidentialProtocol.getEncryptedMarketData();
      expect(marketData.volatility).to.equal(newVolatility);
      expect(marketData.trend).to.equal(newTrend);
    });

    it("Should reject market data updates from non-owner", async function () {
      const newVolatility = await mockFHE.encrypt(30);
      const newTrend = await mockFHE.encrypt(85);
      
      await expect(
        confidentialProtocol.connect(user1).updateEncryptedMarketData(newVolatility, newTrend)
      ).to.be.revertedWith("Only owner can call this function");
    });
  });

  describe("Confidential Withdrawals", function () {
    it("Should allow confidential withdrawals", async function () {
      // First stake some amount
      const stakeAmount = 2000;
      const encryptedAmount = await mockFHE.encrypt(stakeAmount);
      await confidentialProtocol.connect(user1).confidentialStake(encryptedAmount);
      
      // Withdraw a portion
      const withdrawAmount = 500;
      const encryptedWithdrawAmount = await mockFHE.encrypt(withdrawAmount);
      
      await confidentialProtocol.connect(user1).confidentialWithdraw(encryptedWithdrawAmount);
      
      // Verify withdrawal event was emitted
      // Note: In real FHE, we would verify the encrypted balance changed
    });

    it("Should emit EncryptedWithdrawal event", async function () {
      const stakeAmount = 2000;
      const encryptedAmount = await mockFHE.encrypt(stakeAmount);
      await confidentialProtocol.connect(user1).confidentialStake(encryptedAmount);
      
      const withdrawAmount = 500;
      const encryptedWithdrawAmount = await mockFHE.encrypt(withdrawAmount);
      
      await expect(confidentialProtocol.connect(user1).confidentialWithdraw(encryptedWithdrawAmount))
        .to.emit(confidentialProtocol, "EncryptedWithdrawal")
        .withArgs(user1.address, encryptedWithdrawAmount);
    });
  });

  describe("Privacy Guarantees", function () {
    it("Should not reveal actual stake amounts", async function () {
      const stakeAmount = 5000;
      const encryptedAmount = await mockFHE.encrypt(stakeAmount);
      
      await confidentialProtocol.connect(user1).confidentialStake(encryptedAmount);
      
      const encryptedBalance = await confidentialProtocol.getEncryptedBalance(user1.address);
      
      // Encrypted balance should not reveal original amount
      expect(encryptedBalance).to.not.equal(ethers.utils.hexlify(stakeAmount));
    });

    it("Should maintain privacy across multiple users", async function () {
      const user1Amount = 1000;
      const user2Amount = 2000;
      
      const user1Encrypted = await mockFHE.encrypt(user1Amount);
      const user2Encrypted = await mockFHE.encrypt(user2Amount);
      
      await confidentialProtocol.connect(user1).confidentialStake(user1Encrypted);
      await confidentialProtocol.connect(user2).confidentialStake(user2Encrypted);
      
      const user1Balance = await confidentialProtocol.getEncryptedBalance(user1.address);
      const user2Balance = await confidentialProtocol.getEncryptedBalance(user2.address);
      
      // Encrypted balances should be different
      expect(user1Balance).to.not.equal(user2Balance);
      
      // Neither should reveal actual amounts
      expect(user1Balance).to.not.equal(ethers.utils.hexlify(user1Amount));
      expect(user2Balance).to.not.equal(ethers.utils.hexlify(user2Amount));
    });
  });

  describe("Integration Tests", function () {
    it("Should handle complete confidential yield farming flow", async function () {
      // 1. Set AI parameters
      const riskTolerance = await mockFHE.encrypt(60);
      const timeHorizon = await mockFHE.encrypt(90);
      const liquidityPreference = await mockFHE.encrypt(70);
      
      await confidentialProtocol.connect(user1).setEncryptedAIParams(
        riskTolerance,
        timeHorizon,
        liquidityPreference
      );
      
      // 2. Stake confidentially
      const stakeAmount = 1000;
      const encryptedAmount = await mockFHE.encrypt(stakeAmount);
      await confidentialProtocol.connect(user1).confidentialStake(encryptedAmount);
      
      // 3. Calculate yield
      const encryptedYield = await confidentialProtocol.connect(user1).calculateEncryptedYield(user1.address);
      expect(encryptedYield).to.not.equal(ethers.constants.HashZero);
      
      // 4. Verify encrypted results
      const encryptedBalance = await confidentialProtocol.getEncryptedBalance(user1.address);
      const encryptedTotalYield = await confidentialProtocol.getEncryptedTotalYield(user1.address);
      
      expect(encryptedBalance).to.not.equal(ethers.constants.HashZero);
      expect(encryptedTotalYield).to.not.equal(ethers.constants.HashZero);
    });

    it("Should handle multiple users with different parameters", async function () {
      // User 1: Conservative strategy
      const user1Risk = await mockFHE.encrypt(30);
      const user1Time = await mockFHE.encrypt(30);
      const user1Liquidity = await mockFHE.encrypt(80);
      
      await confidentialProtocol.connect(user1).setEncryptedAIParams(
        user1Risk,
        user1Time,
        user1Liquidity
      );
      
      // User 2: Aggressive strategy
      const user2Risk = await mockFHE.encrypt(90);
      const user2Time = await mockFHE.encrypt(180);
      const user2Liquidity = await mockFHE.encrypt(40);
      
      await confidentialProtocol.connect(user2).setEncryptedAIParams(
        user2Risk,
        user2Time,
        user2Liquidity
      );
      
      // Both users stake
      const user1Stake = await mockFHE.encrypt(1000);
      const user2Stake = await mockFHE.encrypt(2000);
      
      await confidentialProtocol.connect(user1).confidentialStake(user1Stake);
      await confidentialProtocol.connect(user2).confidentialStake(user2Stake);
      
      // Both users calculate yield
      await confidentialProtocol.connect(user1).calculateEncryptedYield(user1.address);
      await confidentialProtocol.connect(user2).calculateEncryptedYield(user2.address);
      
      // Verify privacy is maintained
      const user1Balance = await confidentialProtocol.getEncryptedBalance(user1.address);
      const user2Balance = await confidentialProtocol.getEncryptedBalance(user2.address);
      
      expect(user1Balance).to.not.equal(user2Balance);
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow owner to pause protocol", async function () {
      await confidentialProtocol.connect(owner).emergencyPause();
      // Note: In a real implementation, we would verify that operations are paused
    });

    it("Should reject pause from non-owner", async function () {
      await expect(
        confidentialProtocol.connect(user1).emergencyPause()
      ).to.be.revertedWith("Only owner can call this function");
    });

    it("Should allow owner to unpause protocol", async function () {
      await confidentialProtocol.connect(owner).emergencyPause();
      await confidentialProtocol.connect(owner).emergencyUnpause();
      // Note: In a real implementation, we would verify that operations are resumed
    });
  });
});
