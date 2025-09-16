# 🚀 Quantum DeFi Protocol - Deployment Guide

## 📋 **Deployment Checklist**

### ✅ **Current Status:**
- **Frontend:** ✅ Running locally on http://localhost:3004
- **Local Blockchain:** ✅ Hardhat node running on port 8545
- **Smart Contracts:** ✅ Deployed locally
- **MetaMask Integration:** ✅ Ready for testing

---

## 🌐 **Step 1: Deploy Smart Contracts to Testnets with Real Assets**

### Prerequisites:
1. **Testnet Tokens** - Get ETH/MATIC from faucets
2. **Infura/Alchemy Account** - For RPC endpoints
3. **Block Explorer API Keys** - For contract verification

### Setup Environment:
```bash
# 1. Copy environment template
cp env.example .env

# 2. Edit .env with your credentials
nano .env
```

### Required Environment Variables:
```env
# Sepolia Testnet
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
SEPOLIA_PRIVATE_KEY=your_private_key_without_0x_prefix
ETHERSCAN_API_KEY=your_etherscan_api_key

# Mumbai Testnet
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
MUMBAI_PRIVATE_KEY=your_private_key_without_0x_prefix
POLYGONSCAN_API_KEY=your_polygonscan_api_key

# Arbitrum Sepolia Testnet
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
ARBITRUM_PRIVATE_KEY=your_private_key_without_0x_prefix
ARBISCAN_API_KEY=your_arbiscan_api_key

# Base Sepolia Testnet
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_PRIVATE_KEY=your_private_key_without_0x_prefix
BASESCAN_API_KEY=your_basescan_api_key
```

### Deploy to All Testnets with Real Assets:
```bash
# Compile contracts
npx hardhat compile

# Deploy to all testnets with real assets
npm run deploy:all-testnets

# Or deploy individually:
npm run deploy:testnet    # Sepolia
npm run deploy:mumbai     # Mumbai (Polygon)
npm run deploy:arbitrum   # Arbitrum Sepolia
npm run deploy:base       # Base Sepolia

# Verify contracts
npm run verify:sepolia
npm run verify:mumbai
npm run verify:arbitrum
npm run verify:base
```

---

## 🌐 **Step 2: Deploy Frontend to Vercel**

### Prerequisites:
1. **Vercel Account** - Sign up at https://vercel.com
2. **GitHub Repository** - Push your code to GitHub
3. **Environment Variables** - Set up in Vercel dashboard

### Deploy via Vercel CLI:
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Deploy via GitHub:
1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com
   - Click "New Project"
   - Import from GitHub
   - Select your repository

3. **Configure Environment Variables:**
   ```
   NEXT_PUBLIC_NETWORK=sepolia
   NEXT_PUBLIC_CHAIN_ID=11155111
   ```

---

## 🌐 **Alternative: Deploy to Netlify**

### Deploy via Netlify CLI:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=out
```

### Deploy via GitHub:
1. **Push to GitHub** (same as above)
2. **Connect to Netlify:**
   - Go to https://netlify.com
   - Click "New site from Git"
   - Connect GitHub repository
   - Build settings: `npm run build`
   - Publish directory: `out`

---

## 🔧 **Environment Configuration**

### Local Development:
```env
NEXT_PUBLIC_NETWORK=localhost
NEXT_PUBLIC_CHAIN_ID=31337
```

### Sepolia Testnet:
```env
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_CHAIN_ID=11155111
```

### Production (Mainnet):
```env
NEXT_PUBLIC_NETWORK=ethereum
NEXT_PUBLIC_CHAIN_ID=1
```

---

## 📱 **MetaMask Configuration**

### Sepolia Testnet:
```
Network Name: Sepolia Testnet
RPC URL: https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
Chain ID: 11155111
Currency Symbol: ETH
Block Explorer: https://sepolia.etherscan.io
```

### Get Testnet ETH:
- **Sepolia Faucet:** https://sepoliafaucet.com/
- **Alchemy Faucet:** https://sepoliafaucet.com/
- **Chainlink Faucet:** https://faucets.chain.link/sepolia

---

## 🧪 **Testing Deployed Contracts**

### 1. **Connect MetaMask to Sepolia**
### 2. **Get Testnet ETH**
### 3. **Visit Deployed Frontend**
### 4. **Test Token Minting**
### 5. **Test Confidential Staking**

---

## 🔍 **Verification Commands**

### Verify on Etherscan:
```bash
# MockERC20
npx hardhat verify --network sepolia CONTRACT_ADDRESS

# MockFHE
npx hardhat verify --network sepolia CONTRACT_ADDRESS

# ConfidentialYieldProtocol
npx hardhat verify --network sepolia CONTRACT_ADDRESS "FHE_CONTRACT_ADDRESS"
```

### Check Deployment:
```bash
# Check contract code
npx hardhat verify --network sepolia CONTRACT_ADDRESS

# Test contract functions
npx hardhat console --network sepolia
```

---

## 📊 **Deployment Monitoring**

### Vercel Dashboard:
- **Analytics:** User visits, performance
- **Functions:** API usage and errors
- **Environment:** Variable management

### Etherscan:
- **Contract:** Source code verification
- **Transactions:** Contract interactions
- **Events:** Smart contract events

---

## 🚨 **Troubleshooting**

### Common Issues:

1. **"Insufficient funds"**
   - Get more testnet ETH from faucets
   - Check gas price settings

2. **"Contract not verified"**
   - Wait for block confirmation
   - Check constructor parameters

3. **"Frontend not loading"**
   - Check environment variables
   - Verify contract addresses

4. **"MetaMask connection failed"**
   - Check network configuration
   - Clear browser cache

---

## 🎯 **Next Steps After Deployment**

1. **✅ Test all functionality on testnet**
2. **✅ Get community feedback**
3. **✅ Security audit**
4. **✅ Deploy to mainnet**
5. **✅ Marketing and adoption**

---

## 📞 **Support**

- **GitHub Issues:** Report bugs and feature requests
- **Discord:** Community support
- **Documentation:** Full technical docs

**Happy Deploying! 🚀**