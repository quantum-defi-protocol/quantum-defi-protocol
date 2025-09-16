# 🦊 MetaMask Setup for Quantum DeFi Protocol

## 🔧 Localhost Network Configuration

To connect MetaMask to the local Hardhat network:

### **Step 1: Add Localhost Network**
1. Open MetaMask
2. Click on the network dropdown (top of MetaMask)
3. Click "Add network" or "Add network manually"

### **Step 2: Network Details**
Enter the following information:

```
Network Name: Hardhat Local
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH
Block Explorer URL: (leave empty)
```

### **Step 3: Save and Switch**
1. Click "Save"
2. Select "Hardhat Local" network
3. You should see "ETH" as the currency

---

## 🪙 Import Test Accounts

Hardhat provides 20 test accounts with 10,000 ETH each.

### **Account 1 (Recommended)**
```
Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### **Account 2**
```
Address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
```

### **How to Import**
1. In MetaMask, click the account icon (top right)
2. Click "Import Account"
3. Select "Private Key"
4. Paste the private key above
5. Click "Import"

---

## 🔗 Connect to Frontend

### **Step 1: Start the Project**
```bash
./setup-complete.sh
```

### **Step 2: Open Frontend**
- Go to http://localhost:3000
- Click "Connect Wallet" button

### **Step 3: Approve Connection**
- MetaMask will open
- Click "Connect" to approve the connection
- You should see your account address in the frontend

---

## 🧪 Test the Interface

### **Confidential Yield Farming**
1. Switch to "🔐 Confidential Yield" tab
2. Enter a stake amount (e.g., 1000)
3. Adjust AI parameters with sliders:
   - Risk Tolerance: 0-100%
   - Time Horizon: 1-365 days
   - Liquidity Preference: 0-100%
4. Click "🔐 Stake Confidentially"
5. Watch the encrypted data appear
6. See your decrypted results

### **What to Expect**
- ✅ FHE Connection Status: "🔒 Connected"
- ✅ Encrypted data displayed as hex strings
- ✅ Decrypted results show actual values
- ✅ Privacy guarantees explained

---

## 🚨 Troubleshooting

### **"Network not found" Error**
- Ensure Hardhat node is running (`npx hardhat node`)
- Check the RPC URL is exactly: `http://127.0.0.1:8545`
- Verify Chain ID is: `31337`

### **"Insufficient funds" Error**
- Import one of the test accounts above
- Each test account has 10,000 ETH
- Check you're on the correct network

### **"Connection failed" Error**
- Refresh the frontend page
- Disconnect and reconnect MetaMask
- Check browser console for errors

### **"Contract not found" Error**
- Ensure contracts are deployed (`npx hardhat run scripts/deploy.js --network localhost`)
- Check deployment logs for contract addresses
- Verify you're on the correct network

---

## 📱 Mobile MetaMask

For mobile testing:

### **Step 1: Connect via QR Code**
1. Open MetaMask mobile app
2. Go to Settings > Networks
3. Add the localhost network manually
4. Use the same network details as above

### **Step 2: Access Frontend**
1. Open browser on mobile
2. Go to http://[your-computer-ip]:3000
3. Connect MetaMask mobile
4. Test the interface

---

## 🔒 Security Notes

### **Test Environment Only**
- These are test accounts with fake ETH
- Never use these private keys on mainnet
- This is for development and testing only

### **Private Key Safety**
- Never share your real private keys
- Use test accounts only for development
- Keep your real MetaMask secure

---

## 🎯 Success Checklist

You'll know everything is working when:

✅ **MetaMask connected** to Hardhat Local network  
✅ **Account imported** with 10,000 ETH balance  
✅ **Frontend loads** at http://localhost:3000  
✅ **"Connect Wallet"** shows your account address  
✅ **FHE client** shows "🔒 Connected" status  
✅ **Confidential staking** works with encrypted data  
✅ **AI parameters** update encrypted values  
✅ **Privacy visualization** shows encrypted/decrypted data  

---

## 🚀 Next Steps

Once MetaMask is connected:

1. **Explore the Interface**: Try all three tabs
2. **Test Confidential Staking**: Enter amounts and see encryption
3. **Adjust AI Parameters**: Watch how they affect yield calculations
4. **Verify Privacy**: See that your data stays encrypted
5. **Test Different Amounts**: Try various stake amounts

The Quantum DeFi Protocol is now ready for testing with full privacy features!

---

**🎉 Happy testing! The future of confidential DeFi awaits at http://localhost:3000**
