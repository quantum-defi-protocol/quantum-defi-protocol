// Contract Configuration
// This file contains the deployed contract addresses for different networks

export const CONTRACTS = {
  localhost: {
    MockFHE: "0x0000000000000000000000000000000000000000",
    ConfidentialYieldProtocol: "0x0000000000000000000000000000000000000000",
    QuantumDeFiCore: "0x0000000000000000000000000000000000000000",
    QuantumYieldFarming: "0x0000000000000000000000000000000000000000",
    QuantumBridge: "0x0000000000000000000000000000000000000000",
    USDC: "0x0000000000000000000000000000000000000000",
    USDT: "0x0000000000000000000000000000000000000000",
    WETH: "0x0000000000000000000000000000000000000000"
  },
  sepolia: {
    MockFHE: "0x0000000000000000000000000000000000000000",
    ConfidentialYieldProtocol: "0x0000000000000000000000000000000000000000",
    QuantumDeFiCore: "0x0000000000000000000000000000000000000000",
    QuantumYieldFarming: "0x0000000000000000000000000000000000000000",
    QuantumBridge: "0x0000000000000000000000000000000000000000",
    USDC: "0x0000000000000000000000000000000000000000",
    USDT: "0x0000000000000000000000000000000000000000",
    WETH: "0x0000000000000000000000000000000000000000"
  },
  mumbai: {
    MockFHE: "0x0000000000000000000000000000000000000000",
    ConfidentialYieldProtocol: "0x0000000000000000000000000000000000000000",
    QuantumDeFiCore: "0x0000000000000000000000000000000000000000",
    QuantumYieldFarming: "0x0000000000000000000000000000000000000000",
    QuantumBridge: "0x0000000000000000000000000000000000000000",
    USDC: "0x0000000000000000000000000000000000000000",
    USDT: "0x0000000000000000000000000000000000000000",
    WETH: "0x0000000000000000000000000000000000000000"
  }
};

// Network configurations
export const NETWORKS = {
  localhost: {
    chainId: 31337,
    name: "Localhost",
    rpcUrl: "http://127.0.0.1:8545",
    blockExplorer: null
  },
  sepolia: {
    chainId: 11155111,
    name: "Sepolia",
    rpcUrl: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
    blockExplorer: "https://sepolia.etherscan.io"
  },
  mumbai: {
    chainId: 80001,
    name: "Mumbai",
    rpcUrl: "https://polygon-mumbai.infura.io/v3/YOUR_INFURA_KEY",
    blockExplorer: "https://mumbai.polygonscan.com"
  }
};

// Helper function to get contracts for current network
export function getContracts(networkName) {
  return CONTRACTS[networkName] || CONTRACTS.localhost;
}

// Helper function to get network config
export function getNetworkConfig(networkName) {
  return NETWORKS[networkName] || NETWORKS.localhost;
}

// Helper function to update contract addresses
export function updateContractAddress(networkName, contractName, address) {
  if (CONTRACTS[networkName] && CONTRACTS[networkName][contractName] !== undefined) {
    CONTRACTS[networkName][contractName] = address;
  }
}

export default {
  CONTRACTS,
  NETWORKS,
  getContracts,
  getNetworkConfig,
  updateContractAddress
};
