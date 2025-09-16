const { ethers } = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('🚀 Starting deployment to Linea network...');
  
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with account:', deployer.address);
  console.log('Account balance:', ethers.utils.formatEther(await deployer.getBalance()));

  // Deploy MockERC20
  console.log('\n📄 Deploying MockERC20...');
  const MockERC20 = await ethers.getContractFactory('MockERC20');
  const mockERC20 = await MockERC20.deploy('Mock USDC', 'USDC', 18);
  await mockERC20.deployed();
  console.log('MockERC20 deployed to:', mockERC20.address);

  // Deploy MockFHE
  console.log('\n🔐 Deploying MockFHE...');
  const MockFHE = await ethers.getContractFactory('MockFHE');
  const mockFHE = await MockFHE.deploy();
  await mockFHE.deployed();
  console.log('MockFHE deployed to:', mockFHE.address);

  // Deploy ConfidentialYieldProtocol
  console.log('\n⚡ Deploying ConfidentialYieldProtocol...');
  const ConfidentialYieldProtocol = await ethers.getContractFactory('ConfidentialYieldProtocol');
  const confidentialYield = await ConfidentialYieldProtocol.deploy(
    mockERC20.address,
    mockFHE.address
  );
  await confidentialYield.deployed();
  console.log('ConfidentialYieldProtocol deployed to:', confidentialYield.address);

  // Deploy CrossChainBridge
  console.log('\n🌉 Deploying CrossChainBridge...');
  const CrossChainBridge = await ethers.getContractFactory('CrossChainBridge');
  const crossChainBridge = await CrossChainBridge.deploy();
  await crossChainBridge.deployed();
  console.log('CrossChainBridge deployed to:', crossChainBridge.address);

  // Deploy UniversalAssetManager
  console.log('\n🌐 Deploying UniversalAssetManager...');
  const UniversalAssetManager = await ethers.getContractFactory('UniversalAssetManager');
  const universalAssetManager = await UniversalAssetManager.deploy(
    crossChainBridge.address
  );
  await universalAssetManager.deployed();
  console.log('UniversalAssetManager deployed to:', universalAssetManager.address);

  // Save deployment info
  const deploymentInfo = {
    network: 'linea',
    chainId: 59144,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      MockERC20: {
        address: mockERC20.address,
        name: 'Mock USDC',
        symbol: 'USDC',
        decimals: 18
      },
      MockFHE: {
        address: mockFHE.address
      },
      ConfidentialYieldProtocol: {
        address: confidentialYield.address,
        token: mockERC20.address,
        fhe: mockFHE.address
      },
      CrossChainBridge: {
        address: crossChainBridge.address
      },
      UniversalAssetManager: {
        address: universalAssetManager.address,
        bridge: crossChainBridge.address
      }
    }
  };

  // Save to file
  const outputPath = path.join(__dirname, '..', 'deployments', 'linea.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));

  console.log('\n✅ Deployment completed successfully!');
  console.log('📁 Deployment info saved to:', outputPath);
  
  // Print summary
  console.log('\n📋 Deployment Summary:');
  console.log('Network: Linea Mainnet');
  console.log('Chain ID: 59144');
  console.log('Deployer:', deployer.address);
  console.log('\nContract Addresses:');
  console.log('MockERC20 (USDC):', mockERC20.address);
  console.log('MockFHE:', mockFHE.address);
  console.log('ConfidentialYieldProtocol:', confidentialYield.address);
  console.log('CrossChainBridge:', crossChainBridge.address);
  console.log('UniversalAssetManager:', universalAssetManager.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });

