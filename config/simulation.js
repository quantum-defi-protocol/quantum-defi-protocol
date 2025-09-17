// Simulation mode configuration for Quantum DeFi Protocol
// This allows the frontend to work without deployed contracts

export const SIMULATION_CONFIG = {
  enabled: true,
  mockAddresses: {
    MockERC20: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    MockFHE: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", 
    ConfidentialYieldProtocol: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    CrossChainBridge: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    UniversalAssetManager: "0xDc64a140Aa3E981100a9bec4e4f8E8C0E5e4f7B1"
  },
  networkInfo: {
    chainId: 31337,
    chainName: "Hardhat Local (Simulation)",
    rpcUrl: "http://127.0.0.1:8545"
  }
};

// Mock contract functions for simulation
export const MOCK_CONTRACTS = {
  MockERC20: {
    name: () => Promise.resolve("Mock USDC"),
    symbol: () => Promise.resolve("USDC"),
    decimals: () => Promise.resolve(18),
    totalSupply: () => Promise.resolve("1000000000000000000000000"), // 1M tokens
    balanceOf: (address) => Promise.resolve("100000000000000000000"), // 100 tokens
    transfer: (to, amount) => Promise.resolve({ hash: `0x${Math.random().toString(16).substr(2, 64)}` }),
    approve: (spender, amount) => Promise.resolve({ hash: `0x${Math.random().toString(16).substr(2, 64)}` }),
    allowance: (owner, spender) => Promise.resolve("0"),
    mint: (to, amount) => Promise.resolve({ hash: `0x${Math.random().toString(16).substr(2, 64)}` })
  },
  
  MockFHE: {
    encrypt: (value) => {
      const timestamp = Date.now();
      const random = Math.random() * 1000000;
      const encrypted = Buffer.from(`${value}-${timestamp}-${random}`).toString('hex');
      return Promise.resolve(`0x${encrypted}`);
    },
    decrypt: (encryptedValue) => {
      try {
        const hex = encryptedValue.replace('0x', '');
        const decoded = Buffer.from(hex, 'hex').toString();
        const parts = decoded.split('-');
        const numericPart = parts[0];
        const parsed = parseFloat(numericPart);
        return Promise.resolve(Number.isNaN(parsed) ? 0 : parsed);
      } catch (error) {
        return Promise.resolve(0);
      }
    },
    add: (a, b) => {
      const aDecrypted = MOCK_CONTRACTS.MockFHE.decrypt(a);
      const bDecrypted = MOCK_CONTRACTS.MockFHE.decrypt(b);
      return MOCK_CONTRACTS.MockFHE.encrypt(aDecrypted + bDecrypted);
    },
    multiply: (a, b) => {
      const aDecrypted = MOCK_CONTRACTS.MockFHE.decrypt(a);
      const bDecrypted = MOCK_CONTRACTS.MockFHE.decrypt(b);
      return MOCK_CONTRACTS.MockFHE.encrypt(aDecrypted * bDecrypted);
    }
  },
  
  ConfidentialYieldProtocol: {
    stakeConfidentially: (encryptedAmount, encryptedParams) => {
      return Promise.resolve({ 
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        wait: () => Promise.resolve()
      });
    },
    withdrawConfidentially: (encryptedAmount) => {
      return Promise.resolve({ 
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        wait: () => Promise.resolve()
      });
    },
    getEncryptedBalance: (user) => {
      const balance = Math.random() * 1000;
      return MOCK_CONTRACTS.MockFHE.encrypt(balance);
    },
    getEncryptedYield: (user) => {
      const yield = Math.random() * 100;
      return MOCK_CONTRACTS.MockFHE.encrypt(yield);
    },
    calculateYieldRate: (encryptedParams) => {
      const rate = 5 + Math.random() * 10; // 5-15% APY
      return MOCK_CONTRACTS.MockFHE.encrypt(rate);
    }
  },
  
  CrossChainBridge: {
    initiateSwap: (targetChainId, tokenAddress, amount, recipient, secretHash) => {
      return Promise.resolve({ 
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        wait: () => Promise.resolve()
      });
    },
    completeSwap: (swapId, secret) => {
      return Promise.resolve({ 
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        wait: () => Promise.resolve()
      });
    },
    getSwapDetails: (swapId) => {
      return Promise.resolve({
        initiator: "0x1234567890123456789012345678901234567890",
        targetChainId: 137,
        tokenAddress: "0x1234567890123456789012345678901234567890",
        amount: "1000000000000000000000",
        recipient: "0x1234567890123456789012345678901234567890",
        secretHash: "0x" + Math.random().toString(16).substr(2, 64),
        status: "pending",
        timestamp: Math.floor(Date.now() / 1000)
      });
    }
  },
  
  UniversalAssetManager: {
    optimizeYield: (tokenAddress, amount) => {
      return Promise.resolve({ 
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        wait: () => Promise.resolve()
      });
    },
    transferCrossChain: (tokenAddress, targetChainId, amount, recipient) => {
      return Promise.resolve({ 
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        wait: () => Promise.resolve()
      });
    },
    getCrossChainBalance: (tokenAddress, chainId) => {
      const balance = Math.random() * 10000;
      return Promise.resolve(balance.toString());
    }
  }
};

// Mock wallet connection
export const MOCK_WALLET = {
  connect: async () => {
    return {
      address: "0x1234567890123456789012345678901234567890",
      chainId: 31337,
      isConnected: true
    };
  },
  disconnect: () => {
    return Promise.resolve();
  },
  switchChain: (chainId) => {
    return Promise.resolve();
  },
  getBalance: (address) => {
    return Promise.resolve("100000000000000000000"); // 100 ETH
  }
};

export default SIMULATION_CONFIG;
