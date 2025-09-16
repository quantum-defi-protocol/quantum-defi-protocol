# Quantum DeFi Protocol - Docker Setup
FROM node:18-alpine

# Install system dependencies
RUN apk add --no-cache git python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose ports
EXPOSE 3000 8545

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "🚀 Starting Quantum DeFi Protocol..."' >> /app/start.sh && \
    echo 'echo "📦 Installing dependencies..."' >> /app/start.sh && \
    echo 'npm install' >> /app/start.sh && \
    echo 'echo "🔨 Compiling contracts..."' >> /app/start.sh && \
    echo 'npx hardhat compile' >> /app/start.sh && \
    echo 'echo "🚀 Starting Hardhat node in background..."' >> /app/start.sh && \
    echo 'npx hardhat node --hostname 0.0.0.0 > /tmp/hardhat.log 2>&1 &' >> /app/start.sh && \
    echo 'echo "⏳ Waiting for Hardhat to start..."' >> /app/start.sh && \
    echo 'sleep 10' >> /app/start.sh && \
    echo 'echo "📄 Deploying contracts..."' >> /app/start.sh && \
    echo 'npx hardhat run scripts/deploy.js --network localhost' >> /app/start.sh && \
    echo 'echo "🌐 Starting frontend..."' >> /app/start.sh && \
    echo 'npm run dev' >> /app/start.sh && \
    chmod +x /app/start.sh

# Default command
CMD ["/app/start.sh"]
