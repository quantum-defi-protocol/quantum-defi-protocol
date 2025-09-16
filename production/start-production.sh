#!/bin/bash

echo "🌌 Quantum DeFi Protocol - Production Mode"
echo "=========================================="

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "✅ Python3 found - starting production server..."
    python3 serve.py
elif command -v node &> /dev/null; then
    echo "✅ Node.js found - trying Next.js..."
    npm install && npm run dev
else
    echo "❌ Neither Python3 nor Node.js found"
    echo "Please install Python3 or Node.js to run the production version"
    exit 1
fi
