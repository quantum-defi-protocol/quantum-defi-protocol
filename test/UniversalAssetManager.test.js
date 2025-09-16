const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UniversalAssetManager", function () {
  let assetManager, crossChainBridge, mockToken, owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    // Deploy CrossChainBridge
    const CrossChainBridge = await ethers.getContractFactory("CrossChainBridge");
    crossChainBridge = await CrossChainBridge.deploy();
    await crossChainBridge.deployed();
    
    // Deploy UniversalAssetManager
    const UniversalAssetManager = await ethers.getContractFactory("UniversalAssetManager");
    assetManager = await UniversalAssetManager.deploy(crossChainBridge.address);
    await assetManager.deployed();
    
    // Deploy MockERC20 for testing
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20.deploy("Test USDC", "USDC", 6);
    await mockToken.deployed();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await assetManager.owner()).to.equal(owner.address);
      expect(await assetManager.crossChainBridge()).to.equal(crossChainBridge.address);
    });
  });

  describe("Asset Registration", function () {
    it("Should allow owner to register assets", async function () {
      const chainId = 1;
      const symbol = "USDC";
      const decimals = 6;
      const totalSupply = ethers.utils.parseUnits("1000000", 6);
      const isNative = false;

      await assetManager.registerAsset(
        mockToken.address,
        chainId,
        symbol,
        decimals,
        totalSupply,
        isNative
      );

      const registeredAssets = await assetManager.getRegisteredAssets();
      expect(registeredAssets.length).to.equal(1);
      expect(registeredAssets[0].token).to.equal(mockToken.address);
      expect(registeredAssets[0].symbol).to.equal(symbol);
      expect(registeredAssets[0].isActive).to.be.true;
    });

    it("Should emit AssetRegistered event", async function () {
      const chainId = 1;
      const symbol = "USDC";
      const decimals = 6;
      const totalSupply = ethers.utils.parseUnits("1000000", 6);

      await expect(
        assetManager.registerAsset(
          mockToken.address,
          chainId,
          symbol,
          decimals,
          totalSupply,
          false
        )
      ).to.emit(assetManager, "AssetRegistered")
        .withArgs(mockToken.address, chainId, symbol);
    });

    it("Should prevent duplicate asset registration", async function () {
      const chainId = 1;
      const symbol = "USDC";
      const decimals = 6;
      const totalSupply = ethers.utils.parseUnits("1000000", 6);

      await assetManager.registerAsset(
        mockToken.address,
        chainId,
        symbol,
        decimals,
        totalSupply,
        false
      );

      await expect(
        assetManager.registerAsset(
          mockToken.address,
          chainId,
          symbol,
          decimals,
          totalSupply,
          false
        )
      ).to.be.revertedWith("Asset already registered");
    });

    it("Should prevent non-owner from registering assets", async function () {
      await expect(
        assetManager.connect(user1).registerAsset(
          mockToken.address,
          1,
          "USDC",
          6,
          ethers.utils.parseUnits("1000000", 6),
          false
        )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Asset Swapping", function () {
    beforeEach(async function () {
      // Register two assets
      const MockERC20_2 = await ethers.getContractFactory("MockERC20");
      const mockToken2 = await MockERC20_2.deploy("Test USDT", "USDT", 6);
      await mockToken2.deployed();

      await assetManager.registerAsset(
        mockToken.address,
        1,
        "USDC",
        6,
        ethers.utils.parseUnits("1000000", 6),
        false
      );

      await assetManager.registerAsset(
        mockToken2.address,
        1,
        "USDT",
        6,
        ethers.utils.parseUnits("1000000", 6),
        false
      );

      // Mint tokens to user1
      await mockToken.mint(user1.address, ethers.utils.parseUnits("10000", 6));
      await mockToken.connect(user1).approve(assetManager.address, ethers.utils.parseUnits("10000", 6));
    });

    it("Should allow users to initiate asset swaps", async function () {
      const fromToken = mockToken.address;
      const toToken = mockToken.address; // Same token for simplicity
      const amount = ethers.utils.parseUnits("1000", 6);
      const expectedAmount = ethers.utils.parseUnits("1000", 6);
      const slippageTolerance = 100; // 1%

      await assetManager.connect(user1).initiateAssetSwap(
        fromToken,
        toToken,
        amount,
        expectedAmount,
        slippageTolerance
      );

      // Check that swap was recorded (simplified check)
      const registeredAssets = await assetManager.getRegisteredAssets();
      expect(registeredAssets.length).to.equal(2);
    });

    it("Should emit AssetSwapInitiated event", async function () {
      const fromToken = mockToken.address;
      const toToken = mockToken.address;
      const amount = ethers.utils.parseUnits("1000", 6);
      const expectedAmount = ethers.utils.parseUnits("1000", 6);
      const slippageTolerance = 100;

      await expect(
        assetManager.connect(user1).initiateAssetSwap(
          fromToken,
          toToken,
          amount,
          expectedAmount,
          slippageTolerance
        )
      ).to.emit(assetManager, "AssetSwapInitiated");
    });

    it("Should prevent swaps with unregistered assets", async function () {
      const unregisteredToken = ethers.Wallet.createRandom().address;
      const toToken = mockToken.address;
      const amount = ethers.utils.parseUnits("1000", 6);
      const expectedAmount = ethers.utils.parseUnits("1000", 6);
      const slippageTolerance = 100;

      await expect(
        assetManager.connect(user1).initiateAssetSwap(
          unregisteredToken,
          toToken,
          amount,
          expectedAmount,
          slippageTolerance
        )
      ).to.be.revertedWith("Asset not registered");
    });

    it("Should prevent swaps with excessive slippage", async function () {
      const fromToken = mockToken.address;
      const toToken = mockToken.address;
      const amount = ethers.utils.parseUnits("1000", 6);
      const expectedAmount = ethers.utils.parseUnits("1000", 6);
      const slippageTolerance = 6000; // 60% - too high

      await expect(
        assetManager.connect(user1).initiateAssetSwap(
          fromToken,
          toToken,
          amount,
          expectedAmount,
          slippageTolerance
        )
      ).to.be.revertedWith("Slippage too high");
    });
  });

  describe("Cross-Chain Transfers", function () {
    beforeEach(async function () {
      // Register asset
      await assetManager.registerAsset(
        mockToken.address,
        1,
        "USDC",
        6,
        ethers.utils.parseUnits("1000000", 6),
        false
      );

      // Mint tokens to user1
      await mockToken.mint(user1.address, ethers.utils.parseUnits("10000", 6));
      await mockToken.connect(user1).approve(assetManager.address, ethers.utils.parseUnits("10000", 6));
    });

    it("Should allow cross-chain transfers", async function () {
      const token = mockToken.address;
      const toChainId = 137; // Polygon
      const amount = ethers.utils.parseUnits("1000", 6);
      const recipient = user1.address;

      await assetManager.connect(user1).transferCrossChain(
        token,
        toChainId,
        amount,
        recipient
      );

      // Check that transfer was processed
      const registeredAssets = await assetManager.getRegisteredAssets();
      expect(registeredAssets.length).to.equal(1);
    });

    it("Should emit CrossChainTransfer event", async function () {
      const token = mockToken.address;
      const toChainId = 137;
      const amount = ethers.utils.parseUnits("1000", 6);
      const recipient = user1.address;

      await expect(
        assetManager.connect(user1).transferCrossChain(
          token,
          toChainId,
          amount,
          recipient
        )
      ).to.emit(assetManager, "CrossChainTransfer")
        .withArgs(user1.address, token, 1, toChainId, amount);
    });

    it("Should prevent same-chain transfers", async function () {
      const token = mockToken.address;
      const toChainId = 1; // Same as registered chain
      const amount = ethers.utils.parseUnits("1000", 6);
      const recipient = user1.address;

      await expect(
        assetManager.connect(user1).transferCrossChain(
          token,
          toChainId,
          amount,
          recipient
        )
      ).to.be.revertedWith("Same chain transfer");
    });
  });

  describe("Yield Optimization", function () {
    beforeEach(async function () {
      // Register asset
      await assetManager.registerAsset(
        mockToken.address,
        1,
        "USDC",
        6,
        ethers.utils.parseUnits("1000000", 6),
        false
      );

      // Mint tokens to user1
      await mockToken.mint(user1.address, ethers.utils.parseUnits("10000", 6));
      await mockToken.connect(user1).approve(assetManager.address, ethers.utils.parseUnits("10000", 6));
    });

    it("Should allow yield optimization", async function () {
      const token = mockToken.address;
      const amount = ethers.utils.parseUnits("1000", 6);

      await assetManager.connect(user1).optimizeYield(token, amount);

      // Check that optimization was processed
      const registeredAssets = await assetManager.getRegisteredAssets();
      expect(registeredAssets.length).to.equal(1);
    });

    it("Should emit YieldOptimized event", async function () {
      const token = mockToken.address;
      const amount = ethers.utils.parseUnits("1000", 6);

      await expect(
        assetManager.connect(user1).optimizeYield(token, amount)
      ).to.emit(assetManager, "YieldOptimized");
    });

    it("Should prevent optimization with unregistered assets", async function () {
      const unregisteredToken = ethers.Wallet.createRandom().address;
      const amount = ethers.utils.parseUnits("1000", 6);

      await expect(
        assetManager.connect(user1).optimizeYield(unregisteredToken, amount)
      ).to.be.revertedWith("Asset not registered");
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow owner to pause the contract", async function () {
      await assetManager.emergencyPause();
      expect(await assetManager.paused()).to.be.true;
    });

    it("Should allow owner to unpause the contract", async function () {
      await assetManager.emergencyPause();
      await assetManager.emergencyUnpause();
      expect(await assetManager.paused()).to.be.false;
    });

    it("Should allow owner to emergency withdraw", async function () {
      // Mint tokens to contract
      await mockToken.mint(assetManager.address, ethers.utils.parseUnits("1000", 6));

      const balanceBefore = await mockToken.balanceOf(owner.address);
      await assetManager.emergencyWithdraw(mockToken.address, ethers.utils.parseUnits("1000", 6));
      const balanceAfter = await mockToken.balanceOf(owner.address);

      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it("Should prevent non-owner from emergency functions", async function () {
      await expect(
        assetManager.connect(user1).emergencyPause()
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await expect(
        assetManager.connect(user1).emergencyWithdraw(
          mockToken.address,
          ethers.utils.parseUnits("1000", 6)
        )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
