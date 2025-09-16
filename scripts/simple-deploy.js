const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting Simple Deployment...");
  
  try {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    
    const balance = await deployer.getBalance();
    console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

    // Deploy MockERC20 first (simplest contract)
    console.log("\n📦 Deploying MockERC20...");
    const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
    const mockToken = await MockERC20.deploy("Test USDC", "USDC");
    await mockToken.waitForDeployment();
    const tokenAddress = await mockToken.getAddress();
    console.log("✅ MockERC20 deployed to:", tokenAddress);

    // Deploy MockFHE
    console.log("\n🔐 Deploying MockFHE...");
    const MockFHE = await hre.ethers.getContractFactory("MockFHE");
    const mockFHE = await MockFHE.deploy();
    await mockFHE.waitForDeployment();
    const fheAddress = await mockFHE.getAddress();
    console.log("✅ MockFHE deployed to:", fheAddress);

    // Deploy ConfidentialYieldProtocol
    console.log("\n🔐 Deploying ConfidentialYieldProtocol...");
    const ConfidentialYieldProtocol = await hre.ethers.getContractFactory("ConfidentialYieldProtocol");
    const confidentialProtocol = await ConfidentialYieldProtocol.deploy(fheAddress);
    await confidentialProtocol.waitForDeployment();
    const protocolAddress = await confidentialProtocol.getAddress();
    console.log("✅ ConfidentialYieldProtocol deployed to:", protocolAddress);

    console.log("\n🎉 Deployment Summary:");
    console.log("===================");
    console.log("MockERC20 (USDC):", tokenAddress);
    console.log("MockFHE:", fheAddress);
    console.log("ConfidentialYieldProtocol:", protocolAddress);
    console.log("===================");

    // Save deployment info
    const deploymentInfo = {
      network: "localhost",
      deployer: deployer.address,
      contracts: {
        MockERC20: tokenAddress,
        MockFHE: fheAddress,
        ConfidentialYieldProtocol: protocolAddress
      },
      timestamp: new Date().toISOString()
    };

    const fs = require('fs');
    fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
    console.log("\n💾 Deployment info saved to deployment-info.json");

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