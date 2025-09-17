# 🚀 Complete Smart Contract Deployment Guide

## 📋 Prerequisites

### 1. Environment Setup
Make sure your `.env` file is configured with:
```bash
# Ethereum Sepolia
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
SEPOLIA_PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Polygon Mumbai
MUMBAI_RPC_URL=https://polygon-mumbai.infura.io/v3/YOUR_INFURA_PROJECT_ID
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here

# Arbitrum Sepolia
ARBITRUM_SEPOLIA_RPC_URL=https://arbitrum-sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
ARBISCAN_API_KEY=your_arbiscan_api_key_here

# Base Sepolia
BASE_SEPOLIA_RPC_URL=https://base-sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
BASESCAN_API_KEY=your_basescan_api_key_here

# Linea Sepolia
LINEA_SEPOLIA_RPC_URL=https://linea-sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
LINEASCAN_API_KEY=your_lineascan_api_key_here
```

### 2. Get Testnet ETH
Visit these faucets to get testnet ETH:

**Ethereum Sepolia:**
- https://sepoliafaucet.com/
- https://faucet.sepolia.dev/

**Polygon Mumbai:**
- https://faucet.polygon.technology/
- https://mumbaifaucet.com/

**Arbitrum Sepolia:**
- https://faucet.quicknode.com/arbitrum/sepolia
- https://bridge.arbitrum.io/

**Base Sepolia:**
- https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- https://bridge.base.org/

**Linea Sepolia:**
- https://faucet.goerli.linea.build/

## 🔧 Deployment Commands

### Deploy to Ethereum Sepolia
```bash
npx hardhat run scripts/deploy-testnet-real-assets.js --network sepolia
```

### Deploy to Polygon Mumbai
```bash
npx hardhat run scripts/deploy-testnet-real-assets.js --network mumbai
```

### Deploy to Arbitrum Sepolia
```bash
npx hardhat run scripts/deploy-testnet-real-assets.js --network arbitrumSepolia
```

### Deploy to Base Sepolia
```bash
npx hardhat run scripts/deploy-testnet-real-assets.js --network baseSepolia
```

### Deploy to Linea Sepolia
```bash
npx hardhat run scripts/deploy-linea-sepolia.js --network lineaSepolia
```

### Deploy to All Testnets
```bash
npm run deploy:all-testnets
```

## 📊 Expected Contract Addresses

After deployment, you'll get addresses like:
```
ConfidentialYieldProtocol deployed to: 0x1234...
CrossChainBridge deployed to: 0x5678...
UniversalAssetManager deployed to: 0x9abc...
```

## 🔗 Real Testnet Assets

### Ethereum Sepolia
- USDC: `0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8`
- WETH: `0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14`

### Polygon Mumbai
- USDC: `0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747`
- WMATIC: `0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889`

### Arbitrum Sepolia
- USDC: `0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d`
- WETH: `0xE591bf0A0CF924A73b1f0B14B808d5aC7a8128a6`

### Base Sepolia
- USDC: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- WETH: `0x4200000000000000000000000000000000000006`

### Linea Sepolia
- USDC: `0x176211869cA2b568f2A7D4EE941E073a821EE1ff`
- WETH: `0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f`

## 🔍 Verification Commands

### Verify on Etherscan
```bash
npx hardhat verify --network sepolia DEPLOYED_ADDRESS
```

### Verify on Polygonscan
```bash
npx hardhat verify --network mumbai DEPLOYED_ADDRESS
```

## 📱 Update Frontend

After deployment, update the frontend configuration:

1. **Update Contract Addresses**: Replace mock addresses in `config/contracts.js`
2. **Update Network Configs**: Ensure RPC URLs are correct
3. **Test Wallet Connection**: Verify MetaMask can connect to testnets
4. **Test Transactions**: Try staking and swapping on testnets

## 🚨 Troubleshooting

### Common Issues:

1. **Insufficient Balance**: Get testnet ETH from faucets
2. **RPC Issues**: Check your Infura/Alchemy project IDs
3. **Gas Estimation**: Increase gas limits if transactions fail
4. **Network Mismatch**: Ensure MetaMask is on the correct network

### WSL Issues:
If you encounter WSL/Node.js path issues:
1. Use Windows Terminal instead of WSL
2. Run commands from Windows Command Prompt
3. Use VS Code integrated terminal with Windows Node.js

## 📈 Next Steps

1. **Deploy Contracts**: Run deployment commands above
2. **Verify Contracts**: Verify on block explorers
3. **Update Frontend**: Replace mock addresses with real ones
4. **Test Integration**: Test full functionality on testnets
5. **Mainnet Deployment**: Deploy to mainnets when ready

## 🎯 Success Criteria

- ✅ Contracts deployed to all 5 testnets
- ✅ Contracts verified on block explorers
- ✅ Frontend updated with real addresses
- ✅ Wallet connection working on all networks
- ✅ Transactions executing successfully
- ✅ Cross-chain swaps functional

---

**Ready to deploy? Start with Sepolia and work your way through each testnet!** 🚀
