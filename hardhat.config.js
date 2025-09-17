require('dotenv').config();
require('@nomicfoundation/hardhat-verify');
require('@nomiclabs/hardhat-ethers');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  telemetry: false,
  logging: false,
  solidity: {
    version: '0.8.18',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
         networks: {
           hardhat: {
             chainId: 31337,
             allowUnlimitedContractSize: true,
             gas: 12000000,
             blockGasLimit: 12000000,
           },
           localhost: {
             url: 'http://127.0.0.1:8545',
             chainId: 31337,
           },
           sepolia: {
             url: process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID',
             accounts: process.env.SEPOLIA_PRIVATE_KEY ? [process.env.SEPOLIA_PRIVATE_KEY] : [],
             chainId: 11155111,
             gasPrice: 20000000000, // 20 gwei
           },
           mumbai: {
             url: process.env.MUMBAI_RPC_URL || 'https://polygon-mumbai.infura.io/v3/YOUR_INFURA_PROJECT_ID',
             accounts: process.env.MUMBAI_PRIVATE_KEY ? [process.env.MUMBAI_PRIVATE_KEY] : [],
             chainId: 80001,
             gasPrice: 20000000000,
           },
           arbitrumSepolia: {
             url: process.env.ARBITRUM_SEPOLIA_RPC_URL || 'https://arbitrum-sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID',
             accounts: process.env.ARBITRUM_PRIVATE_KEY ? [process.env.ARBITRUM_PRIVATE_KEY] : [],
             chainId: 421614,
             gasPrice: 100000000, // 0.1 gwei
           },
          baseSepolia: {
            url: process.env.BASE_SEPOLIA_RPC_URL || 'https://base-sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID',
            accounts: process.env.BASE_PRIVATE_KEY ? [process.env.BASE_PRIVATE_KEY] : [],
            chainId: 84532,
            gasPrice: 1000000000, // 1 gwei
          },
          linea: {
            url: process.env.LINEA_RPC_URL || 'https://linea-mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID',
            accounts: process.env.LINEA_PRIVATE_KEY ? [process.env.LINEA_PRIVATE_KEY] : [],
            chainId: 59144,
            gasPrice: 1000000000, // 1 gwei
          },
          lineaSepolia: {
            url: process.env.LINEA_SEPOLIA_RPC_URL || 'https://linea-sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID',
            accounts: process.env.LINEA_PRIVATE_KEY ? [process.env.LINEA_PRIVATE_KEY] : [],
            chainId: 59141,
            gasPrice: 1000000000, // 1 gwei
          },
        },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || '',
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || '',
      arbitrumSepolia: process.env.ARBISCAN_API_KEY || '',
      baseSepolia: process.env.BASESCAN_API_KEY || '',
      linea: process.env.LINEASCAN_API_KEY || '',
      lineaSepolia: process.env.LINEASCAN_API_KEY || '',
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
};
