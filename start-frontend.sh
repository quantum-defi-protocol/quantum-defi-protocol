#!/bin/bash

# Start frontend in simulation mode
echo "🎨 Starting Quantum DeFi Protocol Frontend (Simulation Mode)..."

# Set working directory
cd /home/laolex/Projects/quantum-defi-protocol

# Check if we're in WSL
if grep -q Microsoft /proc/version; then
    echo "📋 WSL environment detected - using Windows Node.js"
    NODE_PATH="/mnt/c/Program Files/nodejs"
    NPM="$NODE_PATH/npm"
else
    echo "📋 Linux environment detected"
    NPM="npm"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    $NPM install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Set simulation mode environment variable
export NEXT_PUBLIC_SIMULATION_MODE=true
export NEXT_PUBLIC_NETWORK_ID=31337

echo "🔧 Starting in simulation mode..."
echo "📋 Features available:"
echo "   - 🔐 FHE encryption simulation"
echo "   - 🤖 AI yield optimization"
echo "   - 🌐 Cross-chain interface"
echo "   - 💰 Mock token operations"
echo ""

# Start the frontend
echo "🚀 Starting Next.js development server..."
$NPM run dev
