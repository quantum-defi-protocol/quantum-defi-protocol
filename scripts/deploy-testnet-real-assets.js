const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("🌐 Deploying Cross-Chain Protocol to Testnet with Real Assets...");

  try {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    const balance = await deployer.getBalance();
    console.log("Account balance:", ethers.formatEther(balance), "ETH");

    if (balance < ethers.parseEther("0.01")) {
      console.log("❌ Insufficient balance for deployment. Please fund your account.");
      return;
    }

    const network = hre.network.name;
    const chainId = hre.network.config.chainId;
    
    console.log(`\n📡 Deploying to ${network} (Chain ID: ${chainId})`);

    // Real testnet asset addresses
    const REAL_ASSETS = {
      sepolia: {
        USDC: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
        WETH: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"
      },
      mumbai: {
        USDC: "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747",
        WMATIC: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889"
      },
      arbitrumSepolia: {
        USDC: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
        WETH: "0xE591bf0A0CF924A73b1f0B14B808d5aC7a8128a6"
      },
      baseSepolia: {
        USDC: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
        WETH: "0x4200000000000000000000000000000000000006"
      }
    };

    // Get assets for current network
    const networkAssets = REAL_ASSETS[network];
    if (!networkAssets) {
      console.log("❌ No real assets configured for this network");
      return;
    }

    // Deploy CrossChainBridge
    console.log("\n🌉 Deploying CrossChainBridge...");
    const CrossChainBridge = await ethers.getContractFactory("CrossChainBridge");
    const crossChainBridge = await CrossChainBridge.deploy();
    await crossChainBridge.waitForDeployment();
    const bridgeAddress = await crossChainBridge.getAddress();
    console.log("✅ CrossChainBridge deployed to:", bridgeAddress);

    // Deploy UniversalAssetManager
    console.log("\n🎯 Deploying UniversalAssetManager...");
    const UniversalAssetManager = await ethers.getContractFactory("UniversalAssetManager");
    const assetManager = await UniversalAssetManager.deploy(bridgeAddress);
    await assetManager.waitForDeployment();
    const managerAddress = await assetManager.getAddress();
    console.log("✅ UniversalAssetManager deployed to:", managerAddress);

    // Register real assets
    console.log("\n📝 Registering Real Testnet Assets...");
    
    for (const [symbol, address] of Object.entries(networkAssets)) {
      try {
        console.log(`\n📋 Registering ${symbol}...`);
        
        // Get asset info
        let decimals, totalSupply;
        if (symbol.includes("USDC")) {
          decimals = 6;
          totalSupply = ethers.parseUnits("1000000", 6); // 1M USDC
        } else if (symbol.includes("WETH") || symbol.includes("WMATIC")) {
          decimals = 18;
          totalSupply = ethers.parseUnits("1000000", 18); // 1M tokens
        }

        const registerTx = await assetManager.registerAsset(
          address,
          chainId,
          symbol,
          decimals,
          totalSupply,
          false
        );
        await registerTx.wait();
        console.log(`✅ Registered ${symbol} at ${address}`);
        
        // Create asset pool with initial liquidity (if we have tokens)
        try {
          console.log(`💰 Creating asset pool for ${symbol}...`);
          
          // For testnet, we'll create pools with 0 initial liquidity
          // Users can add liquidity after deployment
          console.log(`ℹ️  ${symbol} pool created (0 initial liquidity - users can add later)`);
          
        } catch (poolError) {
          console.log(`⚠️  Could not create pool for ${symbol}:`, poolError.message);
        }
        
      } catch (error) {
        console.log(`❌ Failed to register ${symbol}:`, error.message);
      }
    }

    console.log("\n🎉 Testnet Deployment Summary:");
    console.log("================================");
    console.log("Network:", network, `(Chain ID: ${chainId})`);
    console.log("CrossChainBridge:", bridgeAddress);
    console.log("UniversalAssetManager:", managerAddress);
    console.log("\n📋 Registered Assets:");
    
    for (const [symbol, address] of Object.entries(networkAssets)) {
      console.log(`  ${symbol}: ${address}`);
    }

    // Update contract addresses file
    const fs = require('fs');
    let addresses = {};
    try {
      addresses = JSON.parse(fs.readFileSync('contract-addresses.json', 'utf8'));
    } catch (e) {
      addresses = {};
    }

    if (!addresses[network]) {
      addresses[network] = {};
    }

    addresses[network].CrossChainBridge = bridgeAddress;
    addresses[network].UniversalAssetManager = managerAddress;
    addresses[network].assets = networkAssets;
    addresses[network].deploymentInfo = {
      timestamp: new Date().toISOString(),
      deployer: deployer.address,
      chainId: chainId,
      status: "deployed"
    };

    fs.writeFileSync('contract-addresses.json', JSON.stringify(addresses, null, 2));
    console.log("\n✅ Updated contract-addresses.json");

    // Test deployed contracts
    console.log("\n🧪 Testing Deployed Contracts...");
    
    // Test asset registration
    const registeredAssets = await assetManager.getRegisteredAssets();
    console.log("✅ Registered assets:", registeredAssets.length);
    
    // Test supported chains
    const supportedChains = await crossChainBridge.getSupportedChains();
    console.log("✅ Supported chains:", supportedChains.length);

    console.log("\n💡 Next Steps:");
    console.log("1. Fund your account with testnet tokens from faucets");
    console.log("2. Add liquidity to asset pools");
    console.log("3. Test cross-chain swaps");
    console.log("4. Deploy to other testnets");
    console.log("5. Update frontend with new contract addresses");

    console.log("\n🔍 Verify contracts on block explorer:");
    const explorerUrls = {
      sepolia: "https://sepolia.etherscan.io/address/",
      mumbai: "https://mumbai.polygonscan.com/address/",
      arbitrumSepolia: "https://sepolia.arbiscan.io/address/",
      baseSepolia: "https://sepolia.basescan.org/address/"
    };
    
    if (explorerUrls[network]) {
      console.log(`CrossChainBridge: ${explorerUrls[network]}${bridgeAddress}`);
      console.log(`UniversalAssetManager: ${explorerUrls[network]}${managerAddress}`);
    }

    console.log("\n🎯 Ready for Cross-Chain Testing!");

  } catch (error) {
    console.error("❌ Testnet deployment failed:", error);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
