import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import wallet connection utilities to avoid SSR issues
const loadWalletUtils = async () => {
    if (typeof window !== 'undefined') {
        return await import('../lib/wallet-connection');
    }
    return null;
};

const WalletConnection = ({ onWalletConnected, onWalletDisconnected }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [account, setAccount] = useState('');
    const [balance, setBalance] = useState('0.0000');
    const [chainId, setChainId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [walletUtils, setWalletUtils] = useState(null);
    const [isClient, setIsClient] = useState(false);

    // Check if we're on the client side
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Load wallet utilities on client side
    useEffect(() => {
        if (isClient) {
            loadWalletUtils().then(utils => {
                if (utils) {
                    setWalletUtils(utils);
                    checkConnection(utils);
                }
            });
        }
    }, [isClient]);

    const checkConnection = async (utils = walletUtils) => {
        if (!utils) return;

        try {
            const { walletConnection } = utils;
            if (walletConnection.account) {
                setIsConnected(true);
                setAccount(walletConnection.account);
                setChainId(walletConnection.chainId);
                const bal = await walletConnection.getBalance();
                setBalance(bal);

                if (onWalletConnected) {
                    onWalletConnected({
                        account: walletConnection.account,
                        provider: walletConnection.provider,
                        signer: walletConnection.signer,
                        chainId: walletConnection.chainId,
                    });
                }
            }
        } catch (error) {
            console.error('Error checking connection:', error);
        }
    };

    const connectWallet = async () => {
        if (!walletUtils) return;

        setLoading(true);
        setError('');

        try {
            const { walletConnection } = walletUtils;
            const result = await walletConnection.connectWallet();

            setIsConnected(true);
            setAccount(result.account);
            setChainId(result.chainId);

            const bal = await walletConnection.getBalance();
            setBalance(bal);

            // Set up event listeners
            walletConnection.onAccountsChanged((accounts) => {
                if (accounts.length === 0) {
                    handleDisconnect();
                } else {
                    setAccount(accounts[0]);
                    walletConnection.getBalance().then(setBalance);
                }
            });

            walletConnection.onChainChanged((newChainId) => {
                setChainId(newChainId);
                if (newChainId !== 31337) {
                    setError('Please switch to Hardhat Local Network (Chain ID: 31337)');
                }
            });

            if (onWalletConnected) {
                onWalletConnected(result);
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
            setError(error.message || 'Failed to connect wallet');
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnect = () => {
        walletConnection.disconnectWallet();
        setIsConnected(false);
        setAccount('');
        setBalance('0.0000');
        setChainId(null);
        setError('');

        if (onWalletDisconnected) {
            onWalletDisconnected();
        }
    };

    const switchToLocalhost = async () => {
        try {
            await walletConnection.switchNetwork(31337);
            setError('');
        } catch (error) {
            console.error('Error switching network:', error);
            setError('Failed to switch to localhost network');
        }
    };

    // Show loading state during SSR/hydration
    if (!isClient || !walletUtils) {
        return (
            <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">⏳</span>
                    </div>
                    <div>
                        <h3 className="text-gray-400 font-semibold">Loading...</h3>
                        <p className="text-gray-300 text-sm">
                            Initializing wallet connection
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const { walletConnection, formatAddress, formatBalance } = walletUtils;

    if (!walletConnection.isMetaMaskInstalled()) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">!</span>
                    </div>
                    <div>
                        <h3 className="text-red-400 font-semibold">MetaMask Required</h3>
                        <p className="text-red-300 text-sm">
                            Please install MetaMask to connect your wallet
                        </p>
                        <a
                            href="https://metamask.io"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-400 hover:text-red-300 underline text-sm"
                        >
                            Install MetaMask →
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    if (isConnected) {
        return (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">✓</span>
                        </div>
                        <div>
                            <h3 className="text-green-400 font-semibold">Wallet Connected</h3>
                            <p className="text-green-300 text-sm">
                                {formatAddress(account)} • {formatBalance(balance)} ETH
                            </p>
                            {chainId && chainId !== 31337 && (
                                <p className="text-yellow-300 text-xs">
                                    Chain ID: {chainId} (Switch to localhost)
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        {chainId && chainId !== 31337 && (
                            <button
                                onClick={switchToLocalhost}
                                className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded text-sm hover:bg-yellow-500/30 transition-colors"
                            >
                                Switch Network
                            </button>
                        )}
                        <button
                            onClick={handleDisconnect}
                            className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30 transition-colors"
                        >
                            Disconnect
                        </button>
                    </div>
                </div>
                {error && (
                    <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">🔗</span>
                    </div>
                    <div>
                        <h3 className="text-blue-400 font-semibold">Connect Wallet</h3>
                        <p className="text-blue-300 text-sm">
                            Connect your MetaMask wallet to interact with the protocol
                        </p>
                    </div>
                </div>
                <button
                    onClick={connectWallet}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? 'Connecting...' : 'Connect Wallet'}
                </button>
            </div>
            {error && (
                <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded">
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}
        </div>
    );
};

export default WalletConnection;

