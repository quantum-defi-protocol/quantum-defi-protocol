import React, { useState, useEffect } from 'react';

const NetworkConfig = () => {
  const [contractAddresses, setContractAddresses] = useState({});
  const [currentNetwork, setCurrentNetwork] = useState('localhost');

  useEffect(() => {
    // Load contract addresses based on environment
    const network = process.env.NEXT_PUBLIC_NETWORK || 'localhost';
    setCurrentNetwork(network);

    // Import contract addresses
    import('../contract-addresses.json').then(addresses => {
      setContractAddresses(addresses.default || addresses);
    }).catch(() => {
      // Fallback addresses
      setContractAddresses({
        localhost: {
          MockERC20: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          MockFHE: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
          ConfidentialYieldProtocol: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
        }
      });
    });
  }, []);

  const getNetworkInfo = () => {
    switch (currentNetwork) {
      case 'sepolia':
        return {
          name: 'Sepolia Testnet',
          chainId: 11155111,
          rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID',
          blockExplorer: 'https://sepolia.etherscan.io',
          currency: 'ETH',
          faucet: 'https://sepoliafaucet.com/'
        };
      case 'localhost':
      default:
        return {
          name: 'Hardhat Local',
          chainId: 31337,
          rpcUrl: 'http://127.0.0.1:8545',
          blockExplorer: 'N/A',
          currency: 'ETH',
          faucet: 'N/A'
        };
    }
  };

  const getContractAddresses = () => {
    return contractAddresses[currentNetwork] || contractAddresses.localhost || {};
  };

  const networkInfo = getNetworkInfo();
  const addresses = getContractAddresses();

  return {
    networkInfo,
    contractAddresses: addresses,
    currentNetwork,
    isLocalhost: currentNetwork === 'localhost',
    isTestnet: currentNetwork === 'sepolia'
  };
};

export default NetworkConfig;
