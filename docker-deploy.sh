#!/bin/bash

echo "🐳 Deploying Quantum DeFi Protocol using Docker..."

# Build Docker image
echo "Building Docker image..."
docker build -t quantum-defi-protocol .

# Deploy to Sepolia
echo "Deploying to Sepolia testnet..."
docker run --rm -v $(pwd):/app -w /app quantum-defi-protocol npx hardhat run scripts/deploy-testnet-working.js --network sepolia

# Deploy to Arbitrum Sepolia
echo "Deploying to Arbitrum Sepolia testnet..."
docker run --rm -v $(pwd):/app -w /app quantum-defi-protocol npx hardhat run scripts/deploy-testnet-working.js --network arbitrumSepolia

# Deploy to Base Sepolia
echo "Deploying to Base Sepolia testnet..."
docker run --rm -v $(pwd):/app -w /app quantum-defi-protocol npx hardhat run scripts/deploy-testnet-working.js --network baseSepolia

echo "✅ Deployment complete!"

