const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting Quantum DeFi Protocol Deployment...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance), "ETH");

  // Deploy MockFHE contract first
  console.log("\n📦 Deploying MockFHE contract...");
  const MockFHE = await ethers.getContractFactory("MockFHE");
  const mockFHE = await MockFHE.deploy();
  await mockFHE.deployed();
  console.log("✅ MockFHE deployed to:", mockFHE.address);

  // Deploy ConfidentialYieldProtocol
  console.log("\n🔐 Deploying ConfidentialYieldProtocol...");
  const ConfidentialYieldProtocol = await ethers.getContractFactory("ConfidentialYieldProtocol");
  const confidentialProtocol = await ConfidentialYieldProtocol.deploy(mockFHE.address);
  await confidentialProtocol.deployed();
  console.log("✅ ConfidentialYieldProtocol deployed to:", confidentialProtocol.address);

  // Deploy QuantumDeFiCore
  console.log("\n⚛️ Deploying QuantumDeFiCore...");
  const QuantumDeFiCore = await ethers.getContractFactory("QuantumDeFiCore");
  const coreProtocol = await QuantumDeFiCore.deploy();
  await coreProtocol.deployed();
  console.log("✅ QuantumDeFiCore deployed to:", coreProtocol.address);

  // Deploy QuantumYieldFarming
  console.log("\n🤖 Deploying QuantumYieldFarming...");
  const QuantumYieldFarming = await ethers.getContractFactory("QuantumYieldFarming");
  const yieldFarming = await QuantumYieldFarming.deploy(coreProtocol.address);
  await yieldFarming.deployed();
  console.log("✅ QuantumYieldFarming deployed to:", yieldFarming.address);

  // Deploy QuantumBridge
  console.log("\n⛓️ Deploying QuantumBridge...");
  const QuantumBridge = await ethers.getContractFactory("QuantumBridge");
  const bridge = await QuantumBridge.deploy(coreProtocol.address);
  await bridge.deployed();
  console.log("✅ QuantumBridge deployed to:", bridge.address);

  // Deploy MockERC20 tokens for testing
  console.log("\n🪙 Deploying MockERC20 tokens...");
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  
  const usdc = await MockERC20.deploy("USD Coin", "USDC", 6);
  await usdc.deployed();
  console.log("✅ USDC deployed to:", usdc.address);

  const usdt = await MockERC20.deploy("Tether USD", "USDT", 6);
  await usdt.deployed();
  console.log("✅ USDT deployed to:", usdt.address);

  const weth = await MockERC20.deploy("Wrapped Ethereum", "WETH", 18);
  await weth.deployed();
  console.log("✅ WETH deployed to:", weth.address);

  // Mint tokens to deployer for testing
  console.log("\n💰 Minting test tokens...");
  const mintAmount = ethers.utils.parseUnits("1000000", 6); // 1M USDC/USDT
  const mintAmountETH = ethers.utils.parseEther("1000"); // 1000 WETH

  await usdc.mint(deployer.address, mintAmount);
  await usdt.mint(deployer.address, mintAmount);
  await weth.mint(deployer.address, mintAmountETH);
  console.log("✅ Test tokens minted to deployer");

  // Add supported tokens to core protocol
  console.log("\n🔧 Configuring core protocol...");
  await coreProtocol.addSupportedToken(usdc.address, 500, 8); // 5% reward rate, level 8 quantum resistance
  await coreProtocol.addSupportedToken(usdt.address, 450, 8); // 4.5% reward rate, level 8 quantum resistance
  await coreProtocol.addSupportedToken(weth.address, 600, 9); // 6% reward rate, level 9 quantum resistance
  console.log("✅ Supported tokens added to core protocol");

  // Create yield farming pools
  console.log("\n🌾 Creating yield farming pools...");
  await yieldFarming.createFarm(usdc.address, 500, 365 * 24 * 60 * 60); // 5% APY, 1 year duration
  await yieldFarming.createFarm(usdt.address, 450, 365 * 24 * 60 * 60); // 4.5% APY, 1 year duration
  await yieldFarming.createFarm(weth.address, 600, 365 * 24 * 60 * 60); // 6% APY, 1 year duration
  console.log("✅ Yield farming pools created");

  // Add supported chains to bridge
  console.log("\n🌉 Configuring bridge...");
  await bridge.addSupportedChain(
    137, // Polygon
    "Polygon",
    12, // min confirmations
    ethers.utils.parseEther("1000000"), // max transfer amount
    10, // bridge fee (0.1%)
    8 // quantum resistance level
  );
  
  await bridge.addSupportedChain(
    42161, // Arbitrum
    "Arbitrum One",
    15, // min confirmations
    ethers.utils.parseEther("2000000"), // max transfer amount
    8, // bridge fee (0.08%)
    9 // quantum resistance level
  );
  console.log("✅ Supported chains added to bridge");

  // Save deployment info
  const deploymentInfo = {
    network: await deployer.provider.getNetwork(),
    deployer: deployer.address,
    contracts: {
      MockFHE: mockFHE.address,
      ConfidentialYieldProtocol: confidentialProtocol.address,
      QuantumDeFiCore: coreProtocol.address,
      QuantumYieldFarming: yieldFarming.address,
      QuantumBridge: bridge.address,
      USDC: usdc.address,
      USDT: usdt.address,
      WETH: weth.address
    },
    timestamp: new Date().toISOString()
  };

  // Write deployment info to file
  const fs = require('fs');
  const deploymentPath = './deployments/localhost.json';
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n📝 Deployment info saved to ${deploymentPath}`);

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("====================");
  console.log(`MockFHE: ${mockFHE.address}`);
  console.log(`ConfidentialYieldProtocol: ${confidentialProtocol.address}`);
  console.log(`QuantumDeFiCore: ${coreProtocol.address}`);
  console.log(`QuantumYieldFarming: ${yieldFarming.address}`);
  console.log(`QuantumBridge: ${bridge.address}`);
  console.log(`USDC: ${usdc.address}`);
  console.log(`USDT: ${usdt.address}`);
  console.log(`WETH: ${weth.address}`);

  console.log("\n🔗 Next Steps:");
  console.log("1. Update frontend with contract addresses");
  console.log("2. Test confidential staking functionality");
  console.log("3. Verify FHE operations");
  console.log("4. Run comprehensive tests");

  console.log("\n💡 Frontend Integration:");
  console.log("Copy the contract addresses above to your frontend configuration.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
