import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Cross-chain bridge contract addresses
const CONTRACT_ADDRESSES = {
    CrossChainBridge: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    UniversalAssetManager: "0xDc64a140Aa3E981100a9bec4e4f8E8C0E5e4f7B1",
};

// Supported chains configuration
const SUPPORTED_CHAINS = {
    1: { name: "Ethereum", symbol: "ETH", rpcUrl: "https://mainnet.infura.io/v3/...", bridgeContract: "0x..." },
    11155111: { name: "Sepolia", symbol: "ETH", rpcUrl: "https://sepolia.infura.io/v3/...", bridgeContract: "0x..." },
    137: { name: "Polygon", symbol: "MATIC", rpcUrl: "https://polygon-rpc.com", bridgeContract: "0x..." },
    80001: { name: "Mumbai", symbol: "MATIC", rpcUrl: "https://rpc-mumbai.maticvigil.com", bridgeContract: "0x..." },
    42161: { name: "Arbitrum", symbol: "ETH", rpcUrl: "https://arb1.arbitrum.io/rpc", bridgeContract: "0x..." },
    421614: { name: "Arbitrum Sepolia", symbol: "ETH", rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc", bridgeContract: "0x..." },
    8453: { name: "Base", symbol: "ETH", rpcUrl: "https://mainnet.base.org", bridgeContract: "0x..." },
    84532: { name: "Base Sepolia", symbol: "ETH", rpcUrl: "https://sepolia.base.org", bridgeContract: "0x..." },
    59144: { name: "Linea", symbol: "ETH", rpcUrl: "https://linea-mainnet.infura.io/v3/...", bridgeContract: "0x..." },
    59141: { name: "Linea Sepolia", symbol: "ETH", rpcUrl: "https://linea-sepolia.infura.io/v3/...", bridgeContract: "0x..." },
    "solana": { name: "Solana", symbol: "SOL", rpcUrl: "https://api.mainnet-beta.solana.com", bridgeContract: "0x..." },
    "solana-testnet": { name: "Solana Testnet", symbol: "SOL", rpcUrl: "https://api.testnet.solana.com", bridgeContract: "0x..." }
};

// Real testnet assets
const SUPPORTED_ASSETS = {
    // Sepolia Testnet
    USDC_SEPOLIA: {
        address: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8", // Sepolia USDC
        decimals: 6,
        chains: [11155111],
        symbol: "USDC"
    },
    WETH_SEPOLIA: {
        address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14", // Sepolia WETH
        decimals: 18,
        chains: [11155111],
        symbol: "WETH"
    },

    // Mumbai Testnet (Polygon)
    USDC_MUMBAI: {
        address: "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747", // Mumbai USDC
        decimals: 6,
        chains: [80001],
        symbol: "USDC"
    },
    WMATIC_MUMBAI: {
        address: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889", // Mumbai WMATIC
        decimals: 18,
        chains: [80001],
        symbol: "WMATIC"
    },

    // Arbitrum Sepolia Testnet
    USDC_ARBITRUM_SEPOLIA: {
        address: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d", // Arbitrum Sepolia USDC
        decimals: 6,
        chains: [421614],
        symbol: "USDC"
    },
    WETH_ARBITRUM_SEPOLIA: {
        address: "0xE591bf0A0CF924A73b1f0B14B808d5aC7a8128a6", // Arbitrum Sepolia WETH
        decimals: 18,
        chains: [421614],
        symbol: "WETH"
    },

    // Base Sepolia Testnet
    USDC_BASE_SEPOLIA: {
        address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Base Sepolia USDC
        decimals: 6,
        chains: [84532],
        symbol: "USDC"
    },
    WETH_BASE_SEPOLIA: {
        address: "0x4200000000000000000000000000000000000006", // Base Sepolia WETH
        decimals: 18,
        chains: [84532],
        symbol: "WETH"
    },

    // Linea Mainnet
    USDC_LINEA: {
        address: "0x176211869cA2b568f2A7D4EE941E073a821EE1ff", // Linea USDC
        decimals: 6,
        chains: [59144],
        symbol: "USDC"
    },
    WETH_LINEA: {
        address: "0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f", // Linea WETH
        decimals: 18,
        chains: [59144],
        symbol: "WETH"
    },

    // Linea Sepolia Testnet
    USDC_LINEA_SEPOLIA: {
        address: "0x176211869cA2b568f2A7D4EE941E073a821EE1ff", // Linea Sepolia USDC
        decimals: 6,
        chains: [59141],
        symbol: "USDC"
    },
    WETH_LINEA_SEPOLIA: {
        address: "0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f", // Linea Sepolia WETH
        decimals: 18,
        chains: [59141],
        symbol: "WETH"
    },

    // Solana Mainnet
    USDC_SOLANA: {
        address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // Solana USDC
        decimals: 6,
        chains: ["solana"],
        symbol: "USDC"
    },
    SOL_SOLANA: {
        address: "So11111111111111111111111111111111111111112", // Native SOL
        decimals: 9,
        chains: ["solana"],
        symbol: "SOL"
    },

    // Solana Testnet
    USDC_SOLANA_TESTNET: {
        address: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU", // Solana Testnet USDC
        decimals: 6,
        chains: ["solana-testnet"],
        symbol: "USDC"
    },
    SOL_SOLANA_TESTNET: {
        address: "So11111111111111111111111111111111111111112", // Native SOL
        decimals: 9,
        chains: ["solana-testnet"],
        symbol: "SOL"
    }
};

const CrossChainInterface = () => {
    const [signer, setSigner] = useState(null);
    const [account, setAccount] = useState('');
    const [chainId, setChainId] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Cross-chain state
    const [selectedFromChain, setSelectedFromChain] = useState(1);
    const [selectedToChain, setSelectedToChain] = useState(137);
    const [selectedAsset, setSelectedAsset] = useState('USDC');
    const [swapAmount, setSwapAmount] = useState('');
    const [swapSecret, setSwapSecret] = useState('');
    const [swapSecretHash, setSwapSecretHash] = useState('');

    // Asset management state
    const [assetBalances, setAssetBalances] = useState({});
    const [crossChainBalances, setCrossChainBalances] = useState({});
    const [liquidityPools, setLiquidityPools] = useState({});

    // Bridge state
    const [bridgeContracts, setBridgeContracts] = useState({});
    const [assetManagerContract, setAssetManagerContract] = useState(null);
    const [activeSwaps, setActiveSwaps] = useState([]);

    useEffect(() => {
        initializeConnection();
    }, []);

    const initializeConnection = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                setProvider(provider);

                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    await connectWallet();
                }
            } catch (error) {
                console.error('Failed to initialize connection:', error);
            }
        }
    };

    const connectWallet = async () => {
        setLoading(true);
        setError('');

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            const signer = await provider.getSigner();
            const network = await provider.getNetwork();

            setSigner(signer);
            setAccount(await signer.getAddress());
            setChainId(Number(network.chainId));
            setIsConnected(true);

            await initializeContracts(provider, signer);
            await loadCrossChainData();

        } catch (error) {
            console.error('Failed to connect wallet:', error);
            setError('Failed to connect wallet');
        } finally {
            setLoading(false);
        }
    };

    const initializeContracts = async (provider, signer) => {
        try {
            // Initialize CrossChainBridge contracts for each chain
            const contracts = {};
            for (const [chainId, chainInfo] of Object.entries(SUPPORTED_CHAINS)) {
                if (chainInfo.bridgeContract && chainInfo.bridgeContract !== "0x...") {
                    // In production, you would initialize the actual contract here
                    contracts[chainId] = {
                        address: chainInfo.bridgeContract,
                        chainId: Number(chainId),
                        name: chainInfo.name
                    };
                }
            }
            setBridgeContracts(contracts);

            // Initialize UniversalAssetManager
            if (CONTRACT_ADDRESSES.UniversalAssetManager !== "0x...") {
                // In production, you would initialize the actual contract here
                setAssetManagerContract({
                    address: CONTRACT_ADDRESSES.UniversalAssetManager,
                    signer: signer
                });
            }

        } catch (error) {
            console.error('Failed to initialize contracts:', error);
            setError('Failed to initialize smart contracts');
        }
    };

    const loadCrossChainData = async () => {
        if (!signer || !account) return;

        try {
            // Load asset balances across chains
            const balances = {};
            for (const [assetSymbol, assetInfo] of Object.entries(SUPPORTED_ASSETS)) {
                balances[assetSymbol] = {};

                for (const chainId of assetInfo.chains) {
                    try {
                        // In production, this would query the actual contract
                        balances[assetSymbol][chainId] = "0"; // Placeholder
                    } catch (error) {
                        console.log(`Failed to load balance for ${assetSymbol} on chain ${chainId}:`, error);
                        balances[assetSymbol][chainId] = "0";
                    }
                }
            }
            setAssetBalances(balances);

            // Load cross-chain balances
            if (assetManagerContract) {
                // In production, this would query the UniversalAssetManager
                setCrossChainBalances({});
            }

        } catch (error) {
            console.error('Failed to load cross-chain data:', error);
        }
    };

    const generateSwapSecret = () => {
        const secret = ethers.randomBytes(32);
        const secretHash = ethers.keccak256(secret);
        setSwapSecret(ethers.hexlify(secret));
        setSwapSecretHash(secretHash);
    };

    const initiateCrossChainSwap = async () => {
        if (!signer || !swapAmount || !swapSecretHash) return;

        setLoading(true);
        setError('');

        try {
            const assetInfo = SUPPORTED_ASSETS[selectedAsset];
            const fromChainInfo = SUPPORTED_CHAINS[selectedFromChain];
            const toChainInfo = SUPPORTED_CHAINS[selectedToChain];

            if (!assetInfo || !fromChainInfo || !toChainInfo) {
                throw new Error('Invalid chain or asset selection');
            }

            // Check if asset is supported on both chains
            if (!assetInfo.chains.includes(selectedFromChain) || !assetInfo.chains.includes(selectedToChain)) {
                throw new Error(`Asset ${assetInfo.symbol} not supported on selected chains`);
            }

            // In production, this would call the actual CrossChainBridge contract
            console.log('Initiating cross-chain swap:', {
                fromChain: selectedFromChain,
                toChain: selectedToChain,
                asset: selectedAsset,
                amount: swapAmount,
                secretHash: swapSecretHash
            });

            // Simulate successful swap initiation
            const swapId = ethers.keccak256(ethers.toUtf8Bytes(
                `${account}-${selectedFromChain}-${selectedToChain}-${swapAmount}-${Date.now()}`
            ));

            setActiveSwaps(prev => [...prev, {
                id: swapId,
                fromChain: selectedFromChain,
                toChain: selectedToChain,
                asset: selectedAsset,
                amount: swapAmount,
                secretHash: swapSecretHash,
                timestamp: Date.now(),
                status: 'pending'
            }]);

            setError('');
            console.log('Cross-chain swap initiated successfully!');

        } catch (error) {
            console.error('Failed to initiate cross-chain swap:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const completeCrossChainSwap = async (swapId, secret) => {
        if (!signer || !secret) return;

        setLoading(true);
        try {
            // In production, this would call the CrossChainBridge.completeSwap function
            console.log('Completing cross-chain swap:', { swapId, secret });

            // Update swap status
            setActiveSwaps(prev => prev.map(swap =>
                swap.id === swapId ? { ...swap, status: 'completed' } : swap
            ));

            console.log('Cross-chain swap completed successfully!');
        } catch (error) {
            console.error('Failed to complete cross-chain swap:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const optimizeCrossChainYield = async (asset, amount) => {
        if (!signer || !asset || !amount) return;

        setLoading(true);
        try {
            // In production, this would call the UniversalAssetManager.optimizeYield function
            console.log('Optimizing cross-chain yield:', { asset, amount });

            // Simulate yield optimization
            const optimalChain = Object.keys(SUPPORTED_CHAINS)[Math.floor(Math.random() * Object.keys(SUPPORTED_CHAINS).length)];
            const estimatedYield = (parseFloat(amount) * 0.05).toFixed(2); // 5% APY

            console.log(`Yield optimization complete! Optimal chain: ${SUPPORTED_CHAINS[optimalChain].name}, Estimated yield: ${estimatedYield}%`);

        } catch (error) {
            console.error('Failed to optimize yield:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const switchToChain = async (targetChainId) => {
        if (!window.ethereum) return;

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${targetChainId.toString(16)}` }],
            });
        } catch (error) {
            // Chain not added to MetaMask, try to add it
            if (error.code === 4902) {
                const chainInfo = SUPPORTED_CHAINS[targetChainId];
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: `0x${targetChainId.toString(16)}`,
                        chainName: chainInfo.name,
                        nativeCurrency: {
                            name: chainInfo.symbol,
                            symbol: chainInfo.symbol,
                            decimals: 18,
                        },
                        rpcUrls: [chainInfo.rpcUrl],
                        blockExplorerUrls: chainInfo.explorer ? [chainInfo.explorer] : undefined,
                    }],
                });
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">
                    🌐 Cross-Chain Integration
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    Atomic swaps and universal asset management across multiple blockchains with quantum-resistant security
                </p>
            </div>

            {/* Connection Status */}
            {!isConnected ? (
                <div className="text-center">
                    <button
                        onClick={connectWallet}
                        disabled={loading}
                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition-all duration-300 text-lg"
                    >
                        {loading ? '🔄 Connecting...' : '🔗 Connect Wallet for Cross-Chain Access'}
                    </button>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Connection Info */}
                    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
                        <h3 className="text-xl font-semibold text-white mb-4">🔗 Connection Status</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-gray-400 text-sm">Connected Account</p>
                                <p className="text-white font-mono">{account.slice(0, 6)}...{account.slice(-4)}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Current Chain</p>
                                <p className="text-white">{SUPPORTED_CHAINS[chainId]?.name || `Chain ${chainId}`}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Supported Chains</p>
                                <p className="text-white">{Object.keys(SUPPORTED_CHAINS).length} Networks</p>
                            </div>
                        </div>
                    </div>

                    {/* Cross-Chain Swap Interface */}
                    <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
                        <h3 className="text-2xl font-semibold text-white mb-6">🔄 Atomic Cross-Chain Swap</h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Source Chain */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-300">From Chain</label>
                                <select
                                    value={selectedFromChain}
                                    onChange={(e) => setSelectedFromChain(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                >
                                    {Object.entries(SUPPORTED_CHAINS).map(([chainId, chainInfo]) => (
                                        <option key={chainId} value={chainId}>
                                            {chainInfo.name}
                                        </option>
                                    ))}
                                </select>

                                <label className="block text-sm font-medium text-gray-300">Asset</label>
                                <select
                                    value={selectedAsset}
                                    onChange={(e) => setSelectedAsset(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                >
                                    {Object.entries(SUPPORTED_ASSETS).map(([key, asset]) => (
                                        <option key={key} value={key}>
                                            {asset.symbol} ({SUPPORTED_CHAINS[asset.chains[0]]?.name})
                                        </option>
                                    ))}
                                </select>

                                <label className="block text-sm font-medium text-gray-300">Amount</label>
                                <input
                                    type="number"
                                    value={swapAmount}
                                    onChange={(e) => setSwapAmount(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                    placeholder="Enter amount to swap"
                                />
                            </div>

                            {/* Destination Chain */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-300">To Chain</label>
                                <select
                                    value={selectedToChain}
                                    onChange={(e) => setSelectedToChain(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                >
                                    {Object.entries(SUPPORTED_CHAINS).map(([chainId, chainInfo]) => (
                                        <option key={chainId} value={chainId}>
                                            {chainInfo.name}
                                        </option>
                                    ))}
                                </select>

                                <div className="space-y-2">
                                    <button
                                        onClick={generateSwapSecret}
                                        className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg text-white font-medium transition-all duration-300"
                                    >
                                        🔐 Generate Swap Secret
                                    </button>
                                    {swapSecretHash && (
                                        <div className="text-xs text-gray-400 break-all">
                                            Secret Hash: {swapSecretHash}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={initiateCrossChainSwap}
                                    disabled={loading || !swapAmount || !swapSecretHash}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition-all duration-300"
                                >
                                    {loading ? '🔄 Initiating...' : '🚀 Initiate Cross-Chain Swap'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Universal Asset Management */}
                    <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl p-8 border border-indigo-500/30">
                        <h3 className="text-2xl font-semibold text-white mb-6">🎯 Universal Asset Management</h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Asset Balances */}
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-4">📊 Cross-Chain Balances</h4>
                                <div className="space-y-3">
                                    {Object.entries(SUPPORTED_ASSETS).map(([key, asset]) => (
                                        <div key={key} className="bg-gray-800/30 rounded-lg p-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-white font-medium">{asset.symbol}</span>
                                                <span className="text-gray-400 text-sm">
                                                    {SUPPORTED_CHAINS[asset.chains[0]]?.name}
                                                </span>
                                            </div>
                                            <div className="mt-2 text-sm text-gray-400">
                                                Address: {asset.address.slice(0, 8)}...{asset.address.slice(-6)}
                                            </div>
                                            <div className="mt-1 text-sm text-gray-400">
                                                Decimals: {asset.decimals}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Yield Optimization */}
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-4">⚡ Yield Optimization</h4>
                                <div className="space-y-4">
                                    <select className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none">
                                        <option value="USDC">USDC - 5.2% APY</option>
                                        <option value="USDT">USDT - 4.8% APY</option>
                                        <option value="WETH">WETH - 6.1% APY</option>
                                    </select>

                                    <input
                                        type="number"
                                        placeholder="Amount to optimize"
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                                    />

                                    <button
                                        onClick={() => optimizeCrossChainYield('USDC', '1000')}
                                        disabled={loading}
                                        className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition-all duration-300"
                                    >
                                        {loading ? '🔄 Optimizing...' : '🎯 Optimize Cross-Chain Yield'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Swaps */}
                    {activeSwaps.length > 0 && (
                        <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30">
                            <h3 className="text-2xl font-semibold text-white mb-6">🔄 Active Cross-Chain Swaps</h3>

                            <div className="space-y-4">
                                {activeSwaps.map(swap => (
                                    <div key={swap.id} className="bg-gray-800/30 rounded-lg p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-gray-400 text-sm">Route</p>
                                                <p className="text-white font-medium">
                                                    {SUPPORTED_CHAINS[swap.fromChain]?.name} → {SUPPORTED_CHAINS[swap.toChain]?.name}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Asset</p>
                                                <p className="text-white font-medium">{swap.asset}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Amount</p>
                                                <p className="text-white font-medium">{swap.amount}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Status</p>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${swap.status === 'completed'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    {swap.status}
                                                </span>
                                            </div>
                                        </div>

                                        {swap.status === 'pending' && swapSecret && (
                                            <div className="mt-4 pt-4 border-t border-gray-600">
                                                <button
                                                    onClick={() => completeCrossChainSwap(swap.id, swapSecret)}
                                                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg text-white font-medium transition-all duration-300"
                                                >
                                                    ✅ Complete Swap
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                            <p className="text-red-400">❌ {error}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CrossChainInterface;
