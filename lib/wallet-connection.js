// Quantum DeFi Protocol - Wallet Connection Library

const { ethers } = require('ethers');

// Local Hardhat Network Configuration
const LOCALHOST_CONFIG = {
  chainId: 31337,
  chainName: 'Hardhat Local',
  rpcUrls: ['http://127.0.0.1:8545'],
  blockExplorerUrls: null,
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
};

// Testnet Configurations
const SEPOLIA_CONFIG = {
  chainId: 11155111,
  chainName: 'Sepolia Test Network',
  rpcUrls: ['https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID'],
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
};

const MUMBAI_CONFIG = {
  chainId: 80001,
  chainName: 'Mumbai Test Network',
  rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
  blockExplorerUrls: ['https://mumbai.polygonscan.com'],
  nativeCurrency: {
    name: 'Matic',
    symbol: 'MATIC',
    decimals: 18,
  },
};

// Wallet Connection Functions
class WalletConnection {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.account = null;
    this.chainId = null;
  }

  // Check if MetaMask is installed
  isMetaMaskInstalled() {
    return typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask;
  }

  // Get current network
  async getCurrentNetwork() {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }

    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      return parseInt(chainId, 16);
    } catch (error) {
      console.error('Error getting current network:', error);
      throw error;
    }
  }

  // Add network to MetaMask
  async addNetwork(networkConfig) {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkConfig],
      });
    } catch (error) {
      console.error('Error adding network:', error);
      throw error;
    }
  }

  // Switch to network
  async switchNetwork(chainId) {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error) {
      if (error.code === 4902) {
        // Network not added, try to add it
        let networkConfig;
        switch (chainId) {
          case 31337:
            networkConfig = LOCALHOST_CONFIG;
            break;
          case 11155111:
            networkConfig = SEPOLIA_CONFIG;
            break;
          case 80001:
            networkConfig = MUMBAI_CONFIG;
            break;
          default:
            throw new Error(`Unsupported network: ${chainId}`);
        }
        await this.addNetwork(networkConfig);
      } else {
        throw error;
      }
    }
  }

  // Connect to wallet
  async connectWallet() {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      this.account = accounts[0];
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      this.chainId = await this.getCurrentNetwork();

      // Switch to localhost network if not already connected
      if (this.chainId !== 31337) {
        await this.switchNetwork(31337);
        this.chainId = 31337;
      }

      return {
        account: this.account,
        provider: this.provider,
        signer: this.signer,
        chainId: this.chainId,
      };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  // Disconnect wallet
  disconnectWallet() {
    this.provider = null;
    this.signer = null;
    this.account = null;
    this.chainId = null;
  }

  // Get account balance
  async getBalance(address = null) {
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      const addressToCheck = address || this.account;
      const balance = await this.provider.getBalance(addressToCheck);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  // Listen for account changes
  onAccountsChanged(callback) {
    if (!this.isMetaMaskInstalled()) {
      return;
    }

    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        this.disconnectWallet();
      } else {
        this.account = accounts[0];
      }
      callback(accounts);
    });
  }

  // Listen for chain changes
  onChainChanged(callback) {
    if (!this.isMetaMaskInstalled()) {
      return;
    }

    window.ethereum.on('chainChanged', (chainId) => {
      this.chainId = parseInt(chainId, 16);
      callback(this.chainId);
    });
  }

  // Get contract instance
  getContract(contractAddress, contractABI) {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    return new ethers.Contract(contractAddress, contractABI, this.signer);
  }

  // Send transaction
  async sendTransaction(transaction) {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const tx = await this.signer.sendTransaction(transaction);
      return tx;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }
}

// Export singleton instance
const walletConnection = new WalletConnection();

// Export network configurations
const NETWORKS = {
  LOCALHOST: LOCALHOST_CONFIG,
  SEPOLIA: SEPOLIA_CONFIG,
  MUMBAI: MUMBAI_CONFIG,
};

// Export utility functions
const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const formatBalance = (balance) => {
  if (!balance) return '0.0000';
  return parseFloat(balance).toFixed(4);
};

// Export all functions
module.exports = {
  walletConnection,
  NETWORKS,
  formatAddress,
  formatBalance
};
