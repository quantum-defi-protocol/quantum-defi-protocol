# 🚀 Quantum DeFi Protocol - Deployment Guide

This guide covers deploying the Quantum DeFi Protocol to testnets and integrating real FHE libraries for production use.

## 📋 Prerequisites

### 1. Environment Setup
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 2. Environment Variables
Create a `.env` file with the following variables:

```env
# Private key for deployment (NEVER commit this!)
PRIVATE_KEY=your_private_key_here

# RPC URLs for testnets
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
MUMBAI_RPC_URL=https://polygon-mumbai.infura.io/v3/YOUR_INFURA_KEY
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Block explorer API keys for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key
ARBISCAN_API_KEY=your_arbiscan_api_key
BASESCAN_API_KEY=your_basescan_api_key
```

### 3. Testnet Tokens
Get testnet tokens from faucets:
- **Sepolia ETH**: [Sepolia Faucet](https://sepoliafaucet.com/)
- **Mumbai MATIC**: [Polygon Faucet](https://faucet.polygon.technology/)
- **Arbitrum Sepolia ETH**: [Arbitrum Faucet](https://faucet.arbitrum.io/)
- **Base Sepolia ETH**: [Base Faucet](https://bridge.base.org/deposit)

## 🔧 Compilation

```bash
# Compile smart contracts
npm run compile
```

## 🚀 Deployment

### Local Development
```bash
# Start local Hardhat node
npm run node

# Deploy to local network
npm run deploy
```

### Testnet Deployment

#### Sepolia (Ethereum Testnet)
```bash
npm run deploy:testnet
```

#### Mumbai (Polygon Testnet)
```bash
npm run deploy:mumbai
```

#### Arbitrum Sepolia
```bash
npm run deploy:arbitrum
```

#### Base Sepolia
```bash
npm run deploy:base
```

### FHE-Enabled Deployment
```bash
# Deploy with FHE integration
npm run deploy:fhe
```

## 🔍 Contract Verification

After deployment, verify contracts on block explorers:

```bash
# Verify on Sepolia
npm run verify:sepolia <CONTRACT_ADDRESS>

# Verify on Mumbai
npm run verify:mumbai <CONTRACT_ADDRESS>

# Verify on Arbitrum Sepolia
npm run verify:arbitrum <CONTRACT_ADDRESS>

# Verify on Base Sepolia
npm run verify:base <CONTRACT_ADDRESS>
```

## 🔐 FHE Integration

### Real FHE Libraries

The protocol supports integration with real FHE libraries:

#### 1. Microsoft SEAL
```javascript
// Install SEAL WASM bindings
npm install seal-wasm

// Use in your application
import { SEAL } from 'seal-wasm';
```

#### 2. TFHE (Fast FHE)
```javascript
// Install TFHE library
npm install tfhe-js

// Use for faster operations
import { TFHE } from 'tfhe-js';
```

#### 3. HElib
```javascript
// Install HElib bindings
npm install helib-js

// Use for advanced operations
import { HElib } from 'helib-js';
```

### FHE Client Usage

```javascript
import ProductionFHEClient from './utils/fhe-client-production.js';

// Initialize FHE client
const fheClient = new ProductionFHEClient();
await fheClient.initialize('seal'); // or 'tfhe', 'helib'

// Encrypt stake amount
const encryptedStake = await fheClient.encryptStake(100000);

// Calculate confidential yield
const confidentialYield = await fheClient.calculateConfidentialYield(
  encryptedStake,
  8, // 8% APY
  365, // 1 year
  {
    riskTolerance: 75,
    marketTrend: 85
  }
);

// Decrypt result
const decryptedYield = await fheClient.decryptStake(confidentialYield);
```

## 🧪 Testing

### Run All Tests
```bash
npm run test:all
```

### FHE Integration Tests
```bash
npm run test test/fhe-integration.test.js
```

### Frontend Tests
```bash
npm run test:frontend
```

## 📊 Performance Monitoring

The FHE client includes performance monitoring:

```javascript
// Get performance metrics
const metrics = fheClient.getPerformanceMetrics();
console.log('Average encryption time:', metrics.averageEncryptionTime);
console.log('Total operations:', metrics.totalOperations);

// Reset metrics
fheClient.resetPerformanceMetrics();
```

## 🌐 Frontend Integration

### Update Frontend with Testnet Addresses

1. Deploy contracts to testnet
2. Copy deployment addresses from `deployments/` folder
3. Update frontend configuration:

```javascript
// config/contracts.js
export const CONTRACTS = {
  sepolia: {
    confidentialYieldProtocol: '0x...',
    usdc: '0x...',
    usdt: '0x...',
    weth: '0x...'
  }
};
```

### Connect to Testnet

```javascript
// utils/web3.js
import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider(
  'https://sepolia.infura.io/v3/YOUR_INFURA_KEY'
);

const signer = new ethers.Wallet(PRIVATE_KEY, provider);
```

## 🔒 Security Considerations

### 1. Private Key Management
- **NEVER** commit private keys to version control
- Use environment variables for sensitive data
- Consider using hardware wallets for production

### 2. FHE Security
- Use real FHE libraries in production
- Implement proper key management
- Monitor performance and security metrics

### 3. Smart Contract Security
- Verify contracts on block explorers
- Use multi-signature wallets for admin functions
- Implement circuit breakers for emergency stops

## 🚨 Troubleshooting

### Common Issues

#### 1. Insufficient Balance
```
Error: insufficient funds for gas
```
**Solution**: Get testnet tokens from faucets

#### 2. Contract Verification Failed
```
Error: Contract verification failed
```
**Solution**: Check API keys and contract addresses

#### 3. FHE Initialization Failed
```
Error: FHE initialization failed
```
**Solution**: Ensure FHE libraries are properly installed

### Debug Mode

Enable debug logging:

```javascript
// Set debug mode
process.env.DEBUG = 'fhe:*';

// Or in your application
const fheClient = new ProductionFHEClient();
fheClient.debug = true;
```

## 📈 Production Deployment

### 1. Mainnet Preparation
- Replace mock FHE with real Zama FHE contracts
- Implement proper key management
- Set up monitoring and alerting
- Conduct security audits

### 2. Multi-Chain Deployment
- Deploy to multiple networks
- Implement cross-chain functionality
- Set up bridge contracts

### 3. Performance Optimization
- Optimize FHE operations
- Implement caching strategies
- Monitor gas usage

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review deployment logs
3. Verify environment variables
4. Test on local network first

## 🔗 Useful Links

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.io/)
- [Microsoft SEAL](https://github.com/microsoft/SEAL)
- [TFHE Library](https://tfhe.github.io/tfhe/)
- [HElib](https://github.com/homenc/HElib)

---

**⚠️ Important**: This is a testnet deployment guide. For mainnet deployment, additional security measures and audits are required.
