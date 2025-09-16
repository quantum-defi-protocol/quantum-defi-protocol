// Quantum DeFi Protocol - Blockchain Integration
// This script provides blockchain connectivity for the frontend

class BlockchainIntegration {
    constructor() {
        this.contractAddresses = {
            core: '0x...', // Update with deployed addresses
            yieldFarming: '0x...',
            bridge: '0x...',
            confidential: '0x...'
        };
        this.networkConfig = {
            chainId: 31337,
            rpcUrl: 'http://localhost:8545',
            name: 'Hardhat Local'
        };
    }

    async connectWallet() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                return accounts[0];
            } catch (error) {
                console.error('Wallet connection failed:', error);
                return null;
            }
        }
        return null;
    }

    async switchNetwork() {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x7A69' }], // 31337 in hex
            });
        } catch (error) {
            // Network doesn't exist, add it
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: '0x7A69',
                    chainName: 'Hardhat Local',
                    rpcUrls: ['http://localhost:8545'],
                    nativeCurrency: {
                        name: 'ETH',
                        symbol: 'ETH',
                        decimals: 18,
                    },
                }],
            });
        }
    }

    async getBalance(address) {
        try {
            const balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [address, 'latest'],
            });
            return parseInt(balance, 16) / 1e18; // Convert wei to ETH
        } catch (error) {
            console.error('Failed to get balance:', error);
            return 0;
        }
    }

    async sendTransaction(to, value, data = '0x') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: accounts[0],
                    to: to,
                    value: value,
                    data: data,
                }],
            });
            return txHash;
        } catch (error) {
            console.error('Transaction failed:', error);
            return null;
        }
    }
}

// Export for use in frontend
window.BlockchainIntegration = BlockchainIntegration;
