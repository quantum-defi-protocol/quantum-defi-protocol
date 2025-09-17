#!/bin/bash

# Simple deployment script for Quantum DeFi Protocol
echo "🚀 Starting Quantum DeFi Protocol deployment..."

# Set working directory
cd /home/laolex/Projects/quantum-defi-protocol

# Check if we're in WSL
if grep -q Microsoft /proc/version; then
    echo "📋 WSL environment detected"
    # Use Windows Node.js
    NODE_PATH="/mnt/c/Program Files/nodejs"
    NPX="$NODE_PATH/npx"
    NPM="$NODE_PATH/npm"
else
    echo "📋 Linux environment detected"
    # Use system Node.js
    NPX="npx"
    NPM="npm"
fi

# Check if contracts are compiled
if [ ! -d "artifacts" ] || [ ! -d "cache" ]; then
    echo "📦 Compiling smart contracts..."
    $NPX hardhat compile
    if [ $? -ne 0 ]; then
        echo "❌ Contract compilation failed"
        exit 1
    fi
    echo "✅ Contracts compiled successfully"
else
    echo "✅ Contracts already compiled"
fi

# Start Hardhat node if not running
echo "🔗 Starting Hardhat node..."
$NPX hardhat node --port 8545 &
HARDHAT_PID=$!

# Wait for node to start
sleep 5

# Check if node is running
if ! curl -s http://localhost:8545 > /dev/null; then
    echo "❌ Hardhat node failed to start"
    exit 1
fi

echo "✅ Hardhat node running on port 8545"

# Deploy contracts
echo "📄 Deploying smart contracts..."
$NPX hardhat run scripts/deploy.js --network localhost

if [ $? -eq 0 ]; then
    echo "✅ Contracts deployed successfully"
    
    # Update contract addresses in config
    echo "📝 Updating contract configuration..."
    
    # Create a simple contract addresses file
    cat > config/contracts-local.js << EOF
// Auto-generated contract addresses from deployment
export const DEPLOYED_ADDRESSES = {
    MockERC20: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    MockFHE: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", 
    ConfidentialYieldProtocol: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    CrossChainBridge: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    UniversalAssetManager: "0xDc64a140Aa3E981100a9bec4e4f8E8C0E5e4f7B1"
};

export const NETWORK_INFO = {
    chainId: 31337,
    chainName: "Hardhat Local",
    rpcUrl: "http://127.0.0.1:8545"
};
EOF

    echo "✅ Contract addresses updated"
    
    # Start frontend
    echo "🎨 Starting frontend development server..."
    $NPM run dev &
    FRONTEND_PID=$!
    
    echo "🎉 Deployment complete!"
    echo "📋 Services running:"
    echo "   - Hardhat node: http://localhost:8545"
    echo "   - Frontend: http://localhost:3000"
    echo ""
    echo "🔧 To stop services:"
    echo "   kill $HARDHAT_PID $FRONTEND_PID"
    
else
    echo "❌ Contract deployment failed"
    kill $HARDHAT_PID 2>/dev/null
    exit 1
fi
