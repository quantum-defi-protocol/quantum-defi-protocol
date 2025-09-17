@echo off
echo Deploying Quantum DeFi Protocol to Testnet...
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo Error: package.json not found. Please run this from the project root.
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

REM Compile contracts
echo Compiling contracts...
npx hardhat compile

REM Deploy to Sepolia
echo.
echo Deploying to Sepolia testnet...
npx hardhat run scripts/deploy-testnet-working.js --network sepolia

REM Deploy to Arbitrum Sepolia
echo.
echo Deploying to Arbitrum Sepolia testnet...
npx hardhat run scripts/deploy-testnet-working.js --network arbitrumSepolia

REM Deploy to Base Sepolia
echo.
echo Deploying to Base Sepolia testnet...
npx hardhat run scripts/deploy-testnet-working.js --network baseSepolia

echo.
echo Deployment complete!
pause

