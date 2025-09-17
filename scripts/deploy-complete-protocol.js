const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying Complete Quantum DeFi Protocol...");
  
  try {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    
    const balance = await deployer.getBalance();
    console.log("Account balance:", hre.ethers.utils.formatEther(balance), "ETH");

    if (balance.lt(hre.ethers.utils.parseEther("0.01"))) {
      console.log("❌ Insufficient balance for deployment. Please fund your account.");
      return;
    }

    const network = hre.network.name;
    console.log("📡 Deploying to", network);

    // 1. Deploy MockFHE contract
    console.log("\n🔐 Deploying MockFHE contract...");
    const MockFHE = await hre.ethers.getContractFactory("MockFHE");
    const mockFHE = await MockFHE.deploy();
    await mockFHE.deployed();
    const mockFHEAddress = mockFHE.address;
    console.log("✅ MockFHE deployed to:", mockFHEAddress);

    // 2. Deploy CrossChainBridge
    console.log("\n🌉 Deploying CrossChainBridge...");
    const CrossChainBridge = await hre.ethers.getContractFactory("CrossChainBridge");
    const crossChainBridge = await CrossChainBridge.deploy();
    await crossChainBridge.deployed();
    const bridgeAddress = crossChainBridge.address;
    console.log("✅ CrossChainBridge deployed to:", bridgeAddress);

    // 3. Deploy UniversalAssetManager
    console.log("\n🎯 Deploying UniversalAssetManager...");
    const UniversalAssetManager = await hre.ethers.getContractFactory("UniversalAssetManager");
    const assetManager = await UniversalAssetManager.deploy(bridgeAddress);
    await assetManager.deployed();
    const managerAddress = assetManager.address;
    console.log("✅ UniversalAssetManager deployed to:", managerAddress);

    // 4. Deploy ConfidentialYieldProtocol
    console.log("\n🔒 Deploying ConfidentialYieldProtocol...");
    const ConfidentialYieldProtocol = await hre.ethers.getContractFactory("ConfidentialYieldProtocol");
    const confidentialProtocol = await ConfidentialYieldProtocol.deploy(mockFHEAddress);
    await confidentialProtocol.deployed();
    const protocolAddress = confidentialProtocol.address;
    console.log("✅ ConfidentialYieldProtocol deployed to:", protocolAddress);

    // 5. Register real testnet assets based on network
    console.log("\n🔗 Registering real testnet assets...");
    
    const assets = {
      sepolia: [
        {
          address: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8", // Sepolia USDC
          symbol: "USDC",
          decimals: 6,
          chainId: 11155111
        },
        {
          address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14", // Sepolia WETH
          symbol: "WETH",
          decimals: 18,
          chainId: 11155111
        }
      ],
      arbitrumSepolia: [
        {
          address: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d", // Arbitrum Sepolia USDC
          symbol: "USDC",
          decimals: 6,
          chainId: 421614
        },
        {
          address: "0xE591bf0A0CF924A73b1f0B14B808d5aC7a8128a6", // Arbitrum Sepolia WETH
          symbol: "WETH",
          decimals: 18,
          chainId: 421614
        }
      ],
      baseSepolia: [
        {
          address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Base Sepolia USDC
          symbol: "USDC",
          decimals: 6,
          chainId: 84532
        },
        {
          address: "0x4200000000000000000000000000000000000006", // Base Sepolia WETH
          symbol: "WETH",
          decimals: 18,
          chainId: 84532
        }
      ]
    };

    const networkAssets = assets[network] || [];
    
    for (const asset of networkAssets) {
      console.log(`📝 Registering ${asset.symbol} on ${network}...`);
      
      const totalSupply = hre.ethers.utils.parseUnits("1000000", asset.decimals);
      
      const registerTx = await assetManager.registerAsset(
        asset.address,
        asset.chainId,
        asset.symbol,
        asset.decimals,
        totalSupply,
        false // isNative
      );
      
      await registerTx.wait();
      console.log(`✅ ${asset.symbol} registered successfully`);
    }

    console.log("\n🎉 Complete Protocol Deployment Summary:");
    console.log("=====================================");
    console.log("Network:", network);
    console.log("Deployer:", deployer.address);
    console.log("MockFHE:", mockFHEAddress);
    console.log("CrossChainBridge:", bridgeAddress);
    console.log("UniversalAssetManager:", managerAddress);
    console.log("ConfidentialYieldProtocol:", protocolAddress);
    console.log("Assets Registered:", networkAssets.length);
    console.log("=====================================");

    // Save deployment info
    const deploymentInfo = {
      network: network,
      deployer: deployer.address,
      contracts: {
        MockFHE: mockFHEAddress,
        CrossChainBridge: bridgeAddress,
        UniversalAssetManager: managerAddress,
        ConfidentialYieldProtocol: protocolAddress
      },
      assets: networkAssets,
      timestamp: new Date().toISOString()
    };

    const fs = require('fs');
    const filename = `complete-deployment-${network}.json`;
    fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
    console.log(`\n💾 Complete deployment info saved to ${filename}`);

  } catch (error) {
    console.error("❌ Complete protocol deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
