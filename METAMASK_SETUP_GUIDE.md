# MetaMask Setup Guide for Quantum DeFi Protocol

## 🦊 Setting Up MetaMask for Local Development

### Step 1: Install MetaMask
1. Go to [metamask.io](https://metamask.io)
2. Install the MetaMask browser extension
3. Create a new wallet or import existing one

### Step 2: Add Hardhat Local Network
1. Open MetaMask
2. Click on the network dropdown (top of MetaMask)
3. Select "Add Network" or "Add Network Manually"
4. Enter the following details:

```
Network Name: Hardhat Local
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH
Block Explorer URL: (leave empty)
```

### Step 3: Import Test Account
1. In MetaMask, click on account icon (top right)
2. Select "Import Account"
3. Choose "Private Key"
4. Enter this private key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
5. Click "Import"

This will give you the first test account with 10,000 ETH for testing.

### Step 4: Switch to Hardhat Network
1. Make sure you're on "Hardhat Local" network
2. Your account should show 10,000 ETH balance
3. Account address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

### Step 5: Test Connection
1. Go to http://localhost:3003
2. Click on "🔗 Real Blockchain" tab
3. Click "Connect Wallet"
4. MetaMask should prompt you to connect
5. Approve the connection

## 🧪 Test Accounts Available

| Account # | Address | Private Key |
|-----------|---------|-------------|
| 0 | 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 | 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 |
| 1 | 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 | 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d |
| 2 | 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC | 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a |

## 🔗 Contract Addresses (Localhost)

- **MockERC20 (USDC)**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **MockFHE**: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- **ConfidentialYieldProtocol**: `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`

## 🚀 Testing the Protocol

### 1. Mint Test Tokens
- Connect MetaMask to the frontend
- Click "🪙 Mint 1000 Test Tokens"
- Approve the transaction in MetaMask
- You should receive 1000 USDC tokens

### 2. Stake Confidentially
- Enter an amount to stake (e.g., 100 USDC)
- Click "🔐 Stake Confidentially"
- Approve token spending in MetaMask
- Confirm the stake transaction
- View your encrypted balance and yield

### 3. View Encrypted Data
- Your stake amount is encrypted using FHE
- Yield calculations happen on encrypted data
- Only you can decrypt your results

## 🛠️ Troubleshooting

### MetaMask Not Connecting
- Make sure you're on Hardhat Local network (Chain ID: 31337)
- Check that Hardhat node is running on port 8545
- Try refreshing the page and reconnecting

### Transaction Fails
- Ensure you have enough ETH for gas fees
- Check that the contract addresses are correct
- Verify the Hardhat node is running

### Wrong Network
- Switch to Hardhat Local network in MetaMask
- Chain ID must be 31337
- RPC URL must be http://127.0.0.1:8545

## 📝 Notes

- These are test accounts with known private keys - **NEVER use on mainnet**
- All contract addresses are for local development only
- The Hardhat node must be running for the frontend to work
- Gas fees are free on the local network

## 🎯 Next Steps

1. Test the simulation interface first
2. Set up MetaMask with test account
3. Mint test tokens
4. Try confidential staking
5. Explore the encrypted data features

Happy testing! 🚀
