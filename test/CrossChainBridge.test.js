const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrossChainBridge", function () {
  let crossChainBridge, mockToken, owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    // Deploy CrossChainBridge
    const CrossChainBridge = await ethers.getContractFactory("CrossChainBridge");
    crossChainBridge = await CrossChainBridge.deploy();
    await crossChainBridge.deployed();
    
    // Deploy MockERC20 for testing
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20.deploy("Test USDC", "USDC", 6);
    await mockToken.deployed();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await crossChainBridge.owner()).to.equal(owner.address);
    });

    it("Should initialize with default supported chains", async function () {
      const chains = await crossChainBridge.getSupportedChains();
      expect(chains.length).to.be.greaterThan(0);
    });
  });

  describe("Chain Management", function () {
    it("Should allow owner to add supported chains", async function () {
      const chainId = 137; // Polygon
      const chainName = "Polygon";
      const bridgeContract = ethers.Wallet.createRandom().address;
      const minConfirmations = 12;

      await crossChainBridge.addSupportedChain(
        chainId,
        chainName,
        bridgeContract,
        minConfirmations
      );

      const chain = await crossChainBridge.supportedChains(chainId);
      expect(chain.chainId).to.equal(chainId);
      expect(chain.name).to.equal(chainName);
      expect(chain.bridgeContract).to.equal(bridgeContract);
      expect(chain.isActive).to.be.true;
    });

    it("Should emit ChainAdded event", async function () {
      const chainId = 137;
      const chainName = "Polygon";
      const bridgeContract = ethers.Wallet.createRandom().address;

      await expect(
        crossChainBridge.addSupportedChain(
          chainId,
          chainName,
          bridgeContract,
          12
        )
      ).to.emit(crossChainBridge, "ChainAdded")
        .withArgs(chainId, chainName, bridgeContract);
    });
  });

  describe("Asset Pool Management", function () {
    beforeEach(async function () {
      // Mint tokens to owner for testing
      await mockToken.mint(owner.address, ethers.utils.parseUnits("100000", 6));
      await mockToken.approve(crossChainBridge.address, ethers.utils.parseUnits("10000", 6));
    });

    it("Should create asset pool with initial liquidity", async function () {
      const initialLiquidity = ethers.utils.parseUnits("10000", 6);

      await crossChainBridge.createAssetPool(mockToken.address, initialLiquidity);

      const liquidityInfo = await crossChainBridge.getTokenLiquidityInfo(mockToken.address);
      expect(liquidityInfo.totalLiquidity).to.equal(initialLiquidity);
      expect(liquidityInfo.isActive).to.be.true;
    });

    it("Should emit AssetPoolCreated event", async function () {
      const initialLiquidity = ethers.utils.parseUnits("10000", 6);

      await expect(
        crossChainBridge.createAssetPool(mockToken.address, initialLiquidity)
      ).to.emit(crossChainBridge, "AssetPoolCreated")
        .withArgs(mockToken.address, initialLiquidity);
    });

    it("Should allow owner to add liquidity", async function () {
      // First create the pool
      const initialLiquidity = ethers.utils.parseUnits("10000", 6);
      await crossChainBridge.createAssetPool(mockToken.address, initialLiquidity);

      // Add more liquidity
      const additionalLiquidity = ethers.utils.parseUnits("5000", 6);
      await mockToken.approve(crossChainBridge.address, additionalLiquidity);
      
      await crossChainBridge.addLiquidity(mockToken.address, additionalLiquidity, 1);

      const liquidityInfo = await crossChainBridge.getTokenLiquidityInfo(mockToken.address);
      expect(liquidityInfo.totalLiquidity).to.equal(
        initialLiquidity.add(additionalLiquidity)
      );
    });
  });

  describe("Atomic Swaps", function () {
    beforeEach(async function () {
      // Setup asset pool
      const initialLiquidity = ethers.utils.parseUnits("10000", 6);
      await mockToken.mint(owner.address, initialLiquidity);
      await mockToken.approve(crossChainBridge.address, initialLiquidity);
      await crossChainBridge.createAssetPool(mockToken.address, initialLiquidity);

      // Add target chain
      await crossChainBridge.addSupportedChain(137, "Polygon", ethers.Wallet.createRandom().address, 12);
    });

    it("Should allow users to initiate cross-chain swaps", async function () {
      const targetChainId = 137;
      const amount = ethers.utils.parseUnits("1000", 6);
      const recipient = user1.address;
      const secretHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test-secret"));

      // User needs tokens first
      await mockToken.mint(user1.address, amount);
      await mockToken.connect(user1).approve(crossChainBridge.address, amount);

      await crossChainBridge.connect(user1).initiateSwap(
        targetChainId,
        mockToken.address,
        amount,
        recipient,
        secretHash
      );

      // Check that swap was recorded
      const swapId = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["address", "uint256", "uint256", "address", "uint256", "address", "uint256", "uint256", "bytes32"],
          [user1.address, 1, targetChainId, mockToken.address, amount, recipient, 0, await ethers.provider.getBlockNumber(), secretHash]
        )
      );

      const swapRequest = await crossChainBridge.swapRequests(swapId);
      expect(swapRequest.user).to.equal(user1.address);
      expect(swapRequest.targetChainId).to.equal(targetChainId);
      expect(swapRequest.amount).to.equal(amount);
    });

    it("Should emit SwapInitiated event", async function () {
      const targetChainId = 137;
      const amount = ethers.utils.parseUnits("1000", 6);
      const recipient = user1.address;
      const secretHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test-secret"));

      await mockToken.mint(user1.address, amount);
      await mockToken.connect(user1).approve(crossChainBridge.address, amount);

      await expect(
        crossChainBridge.connect(user1).initiateSwap(
          targetChainId,
          mockToken.address,
          amount,
          recipient,
          secretHash
        )
      ).to.emit(crossChainBridge, "SwapInitiated");
    });

    it("Should prevent swaps with insufficient liquidity", async function () {
      const targetChainId = 137;
      const amount = ethers.utils.parseUnits("50000", 6); // More than available
      const recipient = user1.address;
      const secretHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test-secret"));

      await mockToken.mint(user1.address, amount);
      await mockToken.connect(user1).approve(crossChainBridge.address, amount);

      await expect(
        crossChainBridge.connect(user1).initiateSwap(
          targetChainId,
          mockToken.address,
          amount,
          recipient,
          secretHash
        )
      ).to.be.revertedWith("Insufficient liquidity on target chain");
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow owner to pause the contract", async function () {
      await crossChainBridge.emergencyPause();
      expect(await crossChainBridge.paused()).to.be.true;
    });

    it("Should allow owner to unpause the contract", async function () {
      await crossChainBridge.emergencyPause();
      await crossChainBridge.emergencyUnpause();
      expect(await crossChainBridge.paused()).to.be.false;
    });

    it("Should prevent non-owner from pausing", async function () {
      await expect(
        crossChainBridge.connect(user1).emergencyPause()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Access Control", function () {
    it("Should prevent non-owner from adding chains", async function () {
      await expect(
        crossChainBridge.connect(user1).addSupportedChain(
          137,
          "Polygon",
          ethers.Wallet.createRandom().address,
          12
        )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should prevent non-owner from creating asset pools", async function () {
      const initialLiquidity = ethers.utils.parseUnits("10000", 6);
      
      await expect(
        crossChainBridge.connect(user1).createAssetPool(mockToken.address, initialLiquidity)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
