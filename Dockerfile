FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Compile contracts
RUN npx hardhat compile

# Default command
CMD ["npx", "hardhat", "run", "scripts/deploy-testnet-working.js", "--network", "sepolia"]