# 🚀 Quantum DeFi Protocol - Deployment Solutions

## Current Issue
The WSL environment has path conflicts between Windows and Linux Node.js installations, preventing direct deployment.

## ✅ Available Solutions

### Option 1: Windows Command Prompt (Recommended)
Run from Windows Command Prompt (not WSL):

```cmd
# Navigate to your project folder in Windows
cd C:\Users\[username]\AppData\Local\Packages\CanonicalGroupLimited.Ubuntu24.04LTS_[hash]\LocalState\rootfs\home\laolex\Projects\quantum-defi-protocol

# Install dependencies
npm install

# Deploy to Sepolia
npx hardhat run scripts/deploy-testnet-working.js --network sepolia

# Deploy to Arbitrum Sepolia  
npx hardhat run scripts/deploy-testnet-working.js --network arbitrumSepolia

# Deploy to Base Sepolia
npx hardhat run scripts/deploy-testnet-working.js --network baseSepolia
```

### Option 2: Use the Windows Batch File
```cmd
# Run the provided batch file
deploy-windows.bat
```

### Option 3: Docker Deployment
```bash
# Build and deploy using Docker
./docker-deploy.sh
```

### Option 4: Remix IDE (No Local Setup Required)
1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Create a new workspace
3. Copy the contract files:
   - `contracts/CrossChainBridge.sol`
   - `contracts/UniversalAssetManager.sol`
   - `contracts/MockFHE.sol`
4. Compile contracts
5. Deploy using MetaMask connected to testnet

### Option 5: Foundry (Alternative Tool)
```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Deploy contracts
forge build
forge create --rpc-url [RPC_URL] --private-key [PRIVATE_KEY] src/CrossChainBridge.sol:CrossChainBridge
```

## 📋 Prerequisites for Deployment

### Environment Variables (.env file)
```env
# Sepolia Testnet
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
SEPOLIA_PRIVATE_KEY=your_private_key_without_0x_prefix
ETHERSCAN_API_KEY=your_etherscan_api_key

# Arbitrum Sepolia Testnet  
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
ARBITRUM_PRIVATE_KEY=your_private_key_without_0x_prefix
ARBISCAN_API_KEY=your_arbiscan_api_key

# Base Sepolia Testnet
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_PRIVATE_KEY=your_private_key_without_0x_prefix
BASESCAN_API_KEY=your_basescan_api_key
```

### Testnet Tokens Required
- **Sepolia ETH**: Get from [Sepolia Faucet](https://sepoliafaucet.com/)
- **Arbitrum Sepolia ETH**: Get from [Arbitrum Faucet](https://faucet.quicknode.com/arbitrum/sepolia)
- **Base Sepolia ETH**: Get from [Base Faucet](https://faucet.quicknode.com/base/sepolia)

## 🎯 Recommended Deployment Order

1. **Ethereum Sepolia** (Primary testnet)
2. **Arbitrum Sepolia** (L2 scaling)
3. **Base Sepolia** (Coinbase L2)

## 📊 Expected Deployment Results

After successful deployment, you should see:
```
✅ CrossChainBridge deployed to: 0x...
✅ UniversalAssetManager deployed to: 0x...
✅ Assets registered successfully
```

## 🔧 Troubleshooting

### If you get "insufficient balance" error:
- Get testnet tokens from faucets
- Ensure private key is correct
- Check RPC URL is valid

### If you get "contract verification failed":
- Verify API keys are correct
- Wait a few minutes and try again
- Check contract source code matches deployed bytecode

## 📝 Next Steps After Deployment

1. **Update Frontend**: Replace contract addresses in `public/app.html`
2. **Test Integration**: Verify wallet connection works
3. **Deploy Frontend**: Push updates to Netlify
4. **Documentation**: Update README with contract addresses

## 🚀 Quick Start Commands

```bash
# Option 1: Windows Command Prompt
deploy-windows.bat

# Option 2: Docker
./docker-deploy.sh

# Option 3: Manual (Windows CMD)
npx hardhat run scripts/deploy-testnet-working.js --network sepolia
```
