// Quantum DeFi Protocol - Contract Client Library
// Connects frontend to deployed smart contracts

class QuantumDeFiClient {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.contracts = {};
        this.currentNetwork = null;
        
        // Contract ABIs (simplified for demo - in production, import from artifacts)
        this.abis = {
            ConfidentialYieldProtocol: [
                "function confidentialStake(bytes32 encryptedAmount) external",
                "function confidentialWithdraw(bytes32 encryptedAmount) external",
                "function setEncryptedAIParams(bytes32 riskTolerance, bytes32 timeHorizon, bytes32 liquidityPreference) external",
                "function calculateEncryptedYieldRate(address user) external returns (bytes32)",
                "function calculateEncryptedYield(address user) external returns (bytes32)",
                "function getEncryptedBalance(address user) external view returns (bytes32)",
                "function getEncryptedMarketData() external view returns (tuple(bytes32 volatility, bytes32 trend, bytes32 optimalRate))",
                "function owner() external view returns (address)",
                "function fhe() external view returns (address)"
            ],
            CrossChainBridge: [
                "function initiateSwap(address token, uint256 amount, uint256 targetChainId, address recipient) external payable",
                "function completeSwap(bytes32 swapId, bytes32 secret) external",
                "function getSwapStatus(bytes32 swapId) external view returns (tuple(address initiator, address token, uint256 amount, uint256 targetChainId, address recipient, bool completed))",
                "function createAssetPool(address token, uint256 initialLiquidity) external",
                "function getAssetPool(address token) external view returns (tuple(address token, uint256 totalLiquidity, uint256 availableLiquidity, bool isActive, mapping(uint256 => uint256) chainLiquidity))"
            ],
            UniversalAssetManager: [
                "function registerAsset(address token, uint256 chainId, string memory symbol, uint8 decimals, uint256 totalSupply, bool isNative) external",
                "function getAssetInfo(address token) external view returns (tuple(address token, uint256 chainId, string symbol, uint8 decimals, uint256 totalSupply, bool isActive, bool isNative))",
                "function getSupportedAssets() external view returns (address[])",
                "function bridge() external view returns (address)"
            ],
            MockFHE: [
                "function encrypt(uint256 value) external pure returns (bytes32)",
                "function decrypt(bytes32 encryptedValue) external pure returns (uint256)",
                "function add(bytes32 a, bytes32 b) external pure returns (bytes32)",
                "function multiply(bytes32 a, uint256 scalar) external pure returns (bytes32)"
            ]
        };
        
        // Contract addresses for each network
        this.contractAddresses = {
            sepolia: {
                MockFHE: "0x6Eb1aa06f43ABc12Fa0a838A0521068caA1dD916",
                CrossChainBridge: "0x308f3e0442C5406A4b1c73A65D8f012263468202",
                UniversalAssetManager: "0xA2Dcbc40B8F9191f608C3D9c55d5bb4AEdB7c090",
                ConfidentialYieldProtocol: "0x1C0e279979eBcCC6Eb20220BC7eb7Ac93497d993"
            },
            arbitrumSepolia: {
                MockFHE: "0xdBEE9399351a42e7F3dC6d988912988ec1ACC0cA",
                CrossChainBridge: "0x812C613477558337698eD2fb4e7ef91945402353",
                UniversalAssetManager: "0x4D1E48C190E2A066A646731F37245365011c0ec2",
                ConfidentialYieldProtocol: "0xeEa3FdB0256C92b67955b96a08E397A53FBA8c05"
            },
            baseSepolia: {
                MockFHE: "0x4D1E48C190E2A066A646731F37245365011c0ec2",
                CrossChainBridge: "0xeEa3FdB0256C92b67955b96a08E397A53FBA8c05",
                UniversalAssetManager: "0xE6322835dacb2a18CC318683090Df639199fCA94",
                ConfidentialYieldProtocol: "0x1c63Ad304B21b0923e0CCe869a747b6dc4a90D0a"
            }
        };
    }
    
    // Initialize connection to MetaMask
    async initialize() {
        if (typeof window.ethereum === 'undefined') {
            throw new Error('MetaMask not detected. Please install MetaMask.');
        }
        
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = this.provider.getSigner();
        
        // Get current network
        const network = await this.provider.getNetwork();
        this.currentNetwork = this.getNetworkName(network.chainId);
        
        // Initialize contracts
        await this.initializeContracts();
        
        return {
            address: await this.signer.getAddress(),
            network: this.currentNetwork,
            contracts: Object.keys(this.contracts)
        };
    }
    
    // Initialize contract instances
    async initializeContracts() {
        const networkAddresses = this.contractAddresses[this.currentNetwork];
        
        if (!networkAddresses) {
            throw new Error(`Network ${this.currentNetwork} not supported`);
        }
        
        for (const [contractName, address] of Object.entries(networkAddresses)) {
            if (address !== "0x0000000000000000000000000000000000000000") {
                this.contracts[contractName] = new ethers.Contract(
                    address,
                    this.abis[contractName],
                    this.signer
                );
            }
        }
    }
    
    // Get network name from chain ID
    getNetworkName(chainId) {
        const networks = {
            11155111: 'sepolia',
            421614: 'arbitrumSepolia',
            84532: 'baseSepolia'
        };
        return networks[chainId] || 'unknown';
    }
    
    // Confidential Yield Protocol Functions
    async deposit(amount) {
        if (!this.contracts.ConfidentialYieldProtocol) {
            throw new Error('ConfidentialYieldProtocol not deployed on this network');
        }
        
        // Encrypt the amount using MockFHE
        const encryptedAmount = await this.contracts.MockFHE.encrypt(amount);
        
        // Deposit encrypted amount
        const tx = await this.contracts.ConfidentialYieldProtocol.deposit(encryptedAmount);
        await tx.wait();
        
        return tx.hash;
    }
    
    async withdraw(amount) {
        if (!this.contracts.ConfidentialYieldProtocol) {
            throw new Error('ConfidentialYieldProtocol not deployed on this network');
        }
        
        // Encrypt the amount using MockFHE
        const encryptedAmount = await this.contracts.MockFHE.encrypt(amount);
        
        // Withdraw encrypted amount
        const tx = await this.contracts.ConfidentialYieldProtocol.withdraw(encryptedAmount);
        await tx.wait();
        
        return tx.hash;
    }
    
    async getEncryptedBalance() {
        if (!this.contracts.ConfidentialYieldProtocol) {
            throw new Error('ConfidentialYieldProtocol not deployed on this network');
        }
        
        const address = await this.signer.getAddress();
        return await this.contracts.ConfidentialYieldProtocol.getEncryptedBalance(address);
    }
    
    async getMarketData() {
        if (!this.contracts.ConfidentialYieldProtocol) {
            throw new Error('ConfidentialYieldProtocol not deployed on this network');
        }
        
        return await this.contracts.ConfidentialYieldProtocol.getEncryptedMarketData();
    }
    
    async optimizeYield(riskTolerance, timeHorizon, liquidityPreference) {
        if (!this.contracts.ConfidentialYieldProtocol) {
            throw new Error('ConfidentialYieldProtocol not deployed on this network');
        }
        
        // Encrypt parameters using MockFHE
        const encryptedRisk = await this.contracts.MockFHE.encrypt(riskTolerance);
        const encryptedTime = await this.contracts.MockFHE.encrypt(timeHorizon);
        const encryptedLiquidity = await this.contracts.MockFHE.encrypt(liquidityPreference);
        
        return await this.contracts.ConfidentialYieldProtocol.optimizeYield(
            encryptedRisk,
            encryptedTime,
            encryptedLiquidity
        );
    }
    
    // Cross-Chain Bridge Functions
    async initiateCrossChainSwap(token, amount, targetChainId, recipient) {
        if (!this.contracts.CrossChainBridge) {
            throw new Error('CrossChainBridge not deployed on this network');
        }
        
        const tx = await this.contracts.CrossChainBridge.initiateSwap(
            token,
            amount,
            targetChainId,
            recipient,
            { value: token === ethers.constants.AddressZero ? amount : 0 }
        );
        await tx.wait();
        
        return tx.hash;
    }
    
    async completeCrossChainSwap(swapId, secret) {
        if (!this.contracts.CrossChainBridge) {
            throw new Error('CrossChainBridge not deployed on this network');
        }
        
        const tx = await this.contracts.CrossChainBridge.completeSwap(swapId, secret);
        await tx.wait();
        
        return tx.hash;
    }
    
    async getSwapStatus(swapId) {
        if (!this.contracts.CrossChainBridge) {
            throw new Error('CrossChainBridge not deployed on this network');
        }
        
        return await this.contracts.CrossChainBridge.getSwapStatus(swapId);
    }
    
    // Universal Asset Manager Functions
    async getSupportedAssets() {
        if (!this.contracts.UniversalAssetManager) {
            throw new Error('UniversalAssetManager not deployed on this network');
        }
        
        return await this.contracts.UniversalAssetManager.getSupportedAssets();
    }
    
    async getAssetInfo(token) {
        if (!this.contracts.UniversalAssetManager) {
            throw new Error('UniversalAssetManager not deployed on this network');
        }
        
        return await this.contracts.UniversalAssetManager.getAssetInfo(token);
    }
    
    // Utility Functions
    async switchNetwork(chainId) {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${chainId.toString(16)}` }],
            });
            
            // Reinitialize after network switch
            await this.initialize();
            return true;
        } catch (error) {
            console.error('Failed to switch network:', error);
            return false;
        }
    }
    
    // Get current network info
    async getNetworkInfo() {
        const network = await this.provider.getNetwork();
        return {
            chainId: network.chainId,
            name: this.getNetworkName(network.chainId),
            contracts: this.contractAddresses[this.getNetworkName(network.chainId)] || {}
        };
    }
}

// Export for use in frontend
window.QuantumDeFiClient = QuantumDeFiClient;
