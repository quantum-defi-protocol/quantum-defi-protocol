const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting simple deployment test...");
  
  try {
    // Test basic hardhat functionality
    console.log("Testing hardhat connection...");
    
    // Get network info
    const network = hre.network.name;
    console.log("Network:", network);
    
    // Get signers
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deployer address:", deployer.address);
    
    // Get balance
    const balance = await deployer.getBalance();
    console.log("Balance:", hre.ethers.formatEther(balance), "ETH");
    
    // Check if we have enough balance
    if (balance < hre.ethers.parseEther("0.01")) {
      console.log("❌ Insufficient balance. Need at least 0.01 ETH");
      return;
    }
    
    console.log("✅ Environment test passed! Ready to deploy...");
    
    // Deploy CrossChainBridge
    console.log("\n🌉 Deploying CrossChainBridge...");
    const CrossChainBridge = await hre.ethers.getContractFactory("CrossChainBridge");
    const bridge = await CrossChainBridge.deploy();
    await bridge.waitForDeployment();
    const bridgeAddress = await bridge.getAddress();
    console.log("✅ CrossChainBridge deployed to:", bridgeAddress);
    
    // Deploy UniversalAssetManager
    console.log("\n🎯 Deploying UniversalAssetManager...");
    const UniversalAssetManager = await hre.ethers.getContractFactory("UniversalAssetManager");
    const manager = await UniversalAssetManager.deploy(bridgeAddress);
    await manager.waitForDeployment();
    const managerAddress = await manager.getAddress();
    console.log("✅ UniversalAssetManager deployed to:", managerAddress);
    
    console.log("\n🎉 Deployment successful!");
    console.log("Network:", network);
    console.log("CrossChainBridge:", bridgeAddress);
    console.log("UniversalAssetManager:", managerAddress);
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
