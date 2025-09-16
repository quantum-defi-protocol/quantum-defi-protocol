// Contract configuration for Quantum DeFi Protocol
// These are mock addresses for development - replace with actual deployed addresses

export const CONTRACT_ADDRESSES = {
  // Local Hardhat Network (Chain ID: 31337)
  localhost: {
    MockERC20: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Mock USDC
    MockFHE: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", // Mock FHE contract
    ConfidentialYieldProtocol: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", // Main protocol
    QuantumDeFiCore: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9", // Core protocol
    QuantumYieldFarming: "0xDc64a140Aa3E981100a9bec4e4f8E8C0E5e4f7B1", // Yield farming
    QuantumBridge: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707" // Cross-chain bridge
  },
  
  // Sepolia Testnet (Chain ID: 11155111)
  sepolia: {
    MockERC20: "0x0000000000000000000000000000000000000000", // Not deployed yet
    MockFHE: "0x0000000000000000000000000000000000000000", // Not deployed yet
    ConfidentialYieldProtocol: "0x0000000000000000000000000000000000000000", // Not deployed yet
    QuantumDeFiCore: "0x0000000000000000000000000000000000000000", // Not deployed yet
    QuantumYieldFarming: "0x0000000000000000000000000000000000000000", // Not deployed yet
    QuantumBridge: "0x0000000000000000000000000000000000000000" // Not deployed yet
  }
};

export const NETWORK_CONFIG = {
  localhost: {
    chainId: 31337,
    chainName: "Hardhat Local",
    rpcUrl: "http://127.0.0.1:8545",
    blockExplorer: null,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18
    }
  },
  sepolia: {
    chainId: 11155111,
    chainName: "Sepolia Testnet",
    rpcUrl: "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID",
    blockExplorer: "https://sepolia.etherscan.io",
    nativeCurrency: {
      name: "Sepolia ETH",
      symbol: "ETH",
      decimals: 18
    }
  }
};

// Contract ABIs (simplified for frontend integration)
export const CONTRACT_ABIS = {
  MockERC20: [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address owner) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function mint(address to, uint256 amount) external",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "event Approval(address indexed owner, address indexed spender, uint256 value)"
  ],
  
  MockFHE: [
    "function encrypt(uint256 value) external pure returns (bytes32)",
    "function decrypt(bytes32 encryptedValue) external pure returns (uint256)",
    "function add(bytes32 a, bytes32 b) external pure returns (bytes32)",
    "function multiply(bytes32 a, bytes32 b) external pure returns (bytes32)"
  ],
  
  ConfidentialYieldProtocol: [
    "function stakeConfidentially(bytes32 encryptedAmount, bytes32 encryptedParams) external",
    "function withdrawConfidentially(bytes32 encryptedAmount) external",
    "function getEncryptedBalance(address user) external view returns (bytes32)",
    "function getEncryptedYield(address user) external view returns (bytes32)",
    "function calculateYieldRate(bytes32 encryptedParams) external view returns (bytes32)",
    "event ConfidentialStake(address indexed user, bytes32 encryptedAmount)",
    "event ConfidentialWithdrawal(address indexed user, bytes32 encryptedAmount)"
  ]
};

// Helper function to get contract addresses for current network
export function getContractAddresses(chainId) {
  switch (chainId) {
    case 31337:
      return CONTRACT_ADDRESSES.localhost;
    case 11155111:
      return CONTRACT_ADDRESSES.sepolia;
    default:
      return CONTRACT_ADDRESSES.localhost; // Default to localhost
  }
}

// Helper function to get network config
export function getNetworkConfig(chainId) {
  switch (chainId) {
    case 31337:
      return NETWORK_CONFIG.localhost;
    case 11155111:
      return NETWORK_CONFIG.sepolia;
    default:
      return NETWORK_CONFIG.localhost; // Default to localhost
  }
}
