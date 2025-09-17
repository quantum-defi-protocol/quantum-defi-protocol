const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying Complete Quantum DeFi Protocol to Sepolia (Optimized)...");
  
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

    // Gas optimization settings
    const gasOptions = {
      gasLimit: 5000000,
      gasPrice: hre.ethers.utils.parseUnits("20", "gwei")
    };

    // 1. Deploy MockFHE contract
    console.log("\n🔐 Deploying MockFHE contract...");
    const MockFHE = await hre.ethers.getContractFactory("MockFHE");
    const mockFHE = await MockFHE.deploy(gasOptions);
    await mockFHE.deployed();
    const mockFHEAddress = mockFHE.address;
    console.log("✅ MockFHE deployed to:", mockFHEAddress);

    // Check balance after MockFHE deployment
    const balanceAfterMockFHE = await deployer.getBalance();
    console.log("Balance after MockFHE:", hre.ethers.utils.formatEther(balanceAfterMockFHE), "ETH");

    // 2. Deploy CrossChainBridge
    console.log("\n🌉 Deploying CrossChainBridge...");
    const CrossChainBridge = await hre.ethers.getContractFactory("CrossChainBridge");
    const crossChainBridge = await CrossChainBridge.deploy(gasOptions);
    await crossChainBridge.deployed();
    const bridgeAddress = crossChainBridge.address;
    console.log("✅ CrossChainBridge deployed to:", bridgeAddress);

    // Check balance after CrossChainBridge deployment
    const balanceAfterBridge = await deployer.getBalance();
    console.log("Balance after Bridge:", hre.ethers.utils.formatEther(balanceAfterBridge), "ETH");

    // 3. Deploy UniversalAssetManager
    console.log("\n🎯 Deploying UniversalAssetManager...");
    const UniversalAssetManager = await hre.ethers.getContractFactory("UniversalAssetManager");
    const assetManager = await UniversalAssetManager.deploy(bridgeAddress, gasOptions);
    await assetManager.deployed();
    const managerAddress = assetManager.address;
    console.log("✅ UniversalAssetManager deployed to:", managerAddress);

    // Check balance after AssetManager deployment
    const balanceAfterManager = await deployer.getBalance();
    console.log("Balance after Manager:", hre.ethers.utils.formatEther(balanceAfterManager), "ETH");

    // 4. Deploy ConfidentialYieldProtocol
    console.log("\n🔒 Deploying ConfidentialYieldProtocol...");
    const ConfidentialYieldProtocol = await hre.ethers.getContractFactory("ConfidentialYieldProtocol");
    const confidentialProtocol = await ConfidentialYieldProtocol.deploy(mockFHEAddress, gasOptions);
    await confidentialProtocol.deployed();
    const protocolAddress = confidentialProtocol.address;
    console.log("✅ ConfidentialYieldProtocol deployed to:", protocolAddress);

    console.log("\n🎉 Complete Protocol Deployment Summary:");
    console.log("=====================================");
    console.log("Network:", network);
    console.log("Deployer:", deployer.address);
    console.log("MockFHE:", mockFHEAddress);
    console.log("CrossChainBridge:", bridgeAddress);
    console.log("UniversalAssetManager:", managerAddress);
    console.log("ConfidentialYieldProtocol:", protocolAddress);
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
      timestamp: new Date().toISOString()
    };

    const fs = require('fs');
    const filename = `sepolia-complete-deployment.json`;
    fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
    console.log(`\n💾 Deployment info saved to ${filename}`);

    // Update frontend contract addresses
    console.log("\n🔧 Updating frontend with new contract addresses...");
    await updateFrontendContracts(deploymentInfo);

  } catch (error) {
    console.error("❌ Complete protocol deployment failed:", error);
    process.exit(1);
  }
}

async function updateFrontendContracts(deploymentInfo) {
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Read the current app.html file
    const appHtmlPath = path.join(__dirname, '..', 'public', 'app.html');
    let appHtml = fs.readFileSync(appHtmlPath, 'utf8');
    
    // Update Sepolia contract addresses
    const oldSepoliaConfig = /sepolia:\s*{[\s\S]*?}/;
    const newSepoliaConfig = `sepolia: {
                        MockFHE: "${deploymentInfo.contracts.MockFHE}",
                        CrossChainBridge: "${deploymentInfo.contracts.CrossChainBridge}",
                        UniversalAssetManager: "${deploymentInfo.contracts.UniversalAssetManager}",
                        ConfidentialYieldProtocol: "${deploymentInfo.contracts.ConfidentialYieldProtocol}"
                    }`;
    
    appHtml = appHtml.replace(oldSepoliaConfig, newSepoliaConfig);
    
    // Write the updated file
    fs.writeFileSync(appHtmlPath, appHtml);
    console.log("✅ Frontend updated with new Sepolia contract addresses");
    
  } catch (error) {
    console.error("❌ Failed to update frontend:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
