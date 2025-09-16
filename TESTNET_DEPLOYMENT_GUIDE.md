# 🌐 Testnet Deployment Guide

## 🎯 **Overview**

This guide covers deploying the Quantum DeFi Protocol with real testnet assets across multiple blockchain networks. The system includes cross-chain atomic swaps and universal asset management with real USDC, WETH, and WMATIC tokens.

---

## 🌉 **Supported Testnets**

| Network | Chain ID | Native Token | RPC URL | Block Explorer |
|---------|----------|--------------|---------|----------------|
| **Sepolia** | 11155111 | ETH | `https://sepolia.infura.io/v3/...` | [Etherscan](https://sepolia.etherscan.io) |
| **Mumbai** | 80001 | MATIC | `https://rpc-mumbai.maticvigil.com` | [Polygonscan](https://mumbai.polygonscan.com) |
| **Arbitrum Sepolia** | 421614 | ETH | `https://sepolia-rollup.arbitrum.io/rpc` | [Arbiscan](https://sepolia.arbiscan.io) |
| **Base Sepolia** | 84532 | ETH | `https://sepolia.base.org` | [Basescan](https://sepolia.basescan.org) |

---

## 💎 **Real Testnet Assets**

### **Sepolia Testnet**
- **USDC**: `0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8`
- **WETH**: `0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14`

### **Mumbai Testnet (Polygon)**
- **USDC**: `0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747`
- **WMATIC**: `0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889`

### **Arbitrum Sepolia Testnet**
- **USDC**: `0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d`
- **WETH**: `0xE591bf0A0CF924A73b1f0B14B808d5aC7a8128a6`

### **Base Sepolia Testnet**
- **USDC**: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- **WETH**: `0x4200000000000000000000000000000000000006`

---

## 🚀 **Deployment Steps**

### **1. Environment Setup**

```bash
# Install dependencies
npm install

# Copy environment template
cp env.example .env

# Edit .env with your configuration
nano .env
```

### **2. Environment Variables**

```env
# Sepolia Testnet
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
SEPOLIA_PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key

# Mumbai Testnet
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
MUMBAI_PRIVATE_KEY=your_private_key_here
POLYGONSCAN_API_KEY=your_polygonscan_api_key

# Arbitrum Sepolia Testnet
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
ARBITRUM_PRIVATE_KEY=your_private_key_here
ARBISCAN_API_KEY=your_arbiscan_api_key

# Base Sepolia Testnet
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_PRIVATE_KEY=your_private_key_here
BASESCAN_API_KEY=your_basescan_api_key
```

### **3. Deploy to Individual Testnets**

```bash
# Deploy to Sepolia
npm run deploy:testnet

# Deploy to Mumbai
npm run deploy:mumbai

# Deploy to Arbitrum Sepolia
npm run deploy:arbitrum

# Deploy to Base Sepolia
npm run deploy:base
```

### **4. Deploy to All Testnets**

```bash
# Deploy to all testnets at once
npm run deploy:all-testnets
```

---

## 💰 **Getting Testnet Tokens**

### **Sepolia Testnet**
- **ETH Faucet**: https://sepoliafaucet.com/
- **USDC Faucet**: Use the deployed USDC contract to mint tokens
- **WETH**: Wrap ETH using the WETH contract

### **Mumbai Testnet**
- **MATIC Faucet**: https://faucet.polygon.technology/
- **USDC Faucet**: Use the deployed USDC contract to mint tokens
- **WMATIC**: Wrap MATIC using the WMATIC contract

### **Arbitrum Sepolia Testnet**
- **ETH Faucet**: https://faucet.quicknode.com/arbitrum/sepolia
- **USDC Faucet**: Use the deployed USDC contract to mint tokens
- **WETH**: Wrap ETH using the WETH contract

### **Base Sepolia Testnet**
- **ETH Faucet**: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- **USDC Faucet**: Use the deployed USDC contract to mint tokens
- **WETH**: Wrap ETH using the WETH contract

---

## 🔧 **Smart Contracts**

### **CrossChainBridge.sol**
- **Purpose**: Manages cross-chain liquidity and atomic swaps
- **Features**:
  - Real testnet asset support
  - Multi-chain liquidity pools
  - Atomic swap implementation
  - Quantum-resistant security

### **UniversalAssetManager.sol**
- **Purpose**: Universal asset management across chains
- **Features**:
  - Real asset registration
  - Cross-chain balance tracking
  - Yield optimization algorithms
  - Automated cross-chain transfers

---

## 🧪 **Testing Deployment**

### **1. Verify Contracts**

```bash
# Verify on Etherscan (Sepolia)
npx hardhat verify --network sepolia CONTRACT_ADDRESS

# Verify on Polygonscan (Mumbai)
npx hardhat verify --network mumbai CONTRACT_ADDRESS

# Verify on Arbiscan (Arbitrum Sepolia)
npx hardhat verify --network arbitrumSepolia CONTRACT_ADDRESS

# Verify on Basescan (Base Sepolia)
npx hardhat verify --network baseSepolia CONTRACT_ADDRESS
```

### **2. Test Cross-Chain Operations**

```javascript
// Example: Test asset registration
const assetManager = await ethers.getContractAt("UniversalAssetManager", MANAGER_ADDRESS);
const registeredAssets = await assetManager.getRegisteredAssets();
console.log("Registered assets:", registeredAssets.length);

// Example: Test bridge liquidity
const bridge = await ethers.getContractAt("CrossChainBridge", BRIDGE_ADDRESS);
const liquidityInfo = await bridge.getTokenLiquidityInfo(USDC_ADDRESS);
console.log("USDC Liquidity:", liquidityInfo.totalLiquidity);
```

---

## 🎮 **Frontend Integration**

### **1. Update Contract Addresses**

After deployment, update `contract-addresses.json`:

```json
{
  "sepolia": {
    "CrossChainBridge": "0x...",
    "UniversalAssetManager": "0x...",
    "assets": {
      "USDC": "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
      "WETH": "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"
    }
  }
}
```

### **2. Update Frontend Configuration**

```javascript
// Update CrossChainInterface.jsx
const CONTRACT_ADDRESSES = {
  CrossChainBridge: "0x...", // Deployed address
  UniversalAssetManager: "0x..." // Deployed address
};
```

### **3. Test Frontend**

```bash
# Start development server
npm run dev

# Access at http://localhost:3000
# Click "🌐 Cross-Chain" tab
# Connect MetaMask to testnet
# Test cross-chain swaps
```

---

## 🔐 **Security Considerations**

### **Testnet Security**
- **Private Keys**: Never use mainnet private keys on testnets
- **Faucet Limits**: Respect faucet rate limits
- **Contract Verification**: Always verify contracts on block explorers
- **Testing**: Thoroughly test before mainnet deployment

### **Cross-Chain Security**
- **Liquidity Management**: Monitor liquidity across chains
- **Asset Validation**: Verify asset addresses are correct
- **Bridge Security**: Ensure bridge contracts are properly configured
- **Emergency Pause**: Test emergency pause functionality

---

## 📊 **Monitoring & Analytics**

### **Block Explorer Monitoring**

1. **Sepolia**: https://sepolia.etherscan.io
2. **Mumbai**: https://mumbai.polygonscan.com
3. **Arbitrum Sepolia**: https://sepolia.arbiscan.io
4. **Base Sepolia**: https://sepolia.basescan.org

### **Key Metrics to Monitor**

- **Contract Deployments**: Verify all contracts deployed successfully
- **Asset Registrations**: Check all assets are registered correctly
- **Liquidity Pools**: Monitor liquidity across chains
- **Cross-Chain Swaps**: Track swap success rates
- **Gas Usage**: Monitor gas consumption and costs

---

## 🚨 **Troubleshooting**

### **Common Issues**

1. **"Insufficient Balance"**
   - Get testnet tokens from faucets
   - Check gas price settings

2. **"Contract Not Verified"**
   - Run verification commands
   - Check constructor parameters

3. **"Asset Not Registered"**
   - Verify asset addresses are correct
   - Check registration transactions

4. **"Cross-Chain Swap Failed"**
   - Verify liquidity is available
   - Check chain configurations

### **Debug Commands**

```bash
# Check contract deployment
npx hardhat run scripts/deploy-testnet-real-assets.js --network sepolia --verbose

# Test contract functions
npx hardhat console --network sepolia

# Check gas usage
npx hardhat test --gas-report
```

---

## 🎯 **Next Steps**

### **After Deployment**

1. **Test Cross-Chain Swaps**: Test atomic swaps between testnets
2. **Add Liquidity**: Add liquidity to asset pools
3. **Test Yield Optimization**: Test yield optimization features
4. **Monitor Performance**: Monitor system performance
5. **Gather Feedback**: Collect user feedback and improve

### **Production Readiness**

1. **Security Audit**: Conduct comprehensive security audit
2. **Load Testing**: Test under high load conditions
3. **Mainnet Deployment**: Deploy to mainnet networks
4. **Real Assets**: Integrate with real mainnet assets
5. **Governance**: Implement DAO governance

---

## 📞 **Support**

- **Documentation**: Full technical documentation
- **GitHub**: Source code and issues
- **Discord**: Community support
- **Telegram**: Technical discussions

**Happy Testnet Deployment! 🌐🚀**
