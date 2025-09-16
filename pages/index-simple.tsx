import React, { useState } from 'react';
import Head from 'next/head';

export default function Home() {
    const [isConnected, setIsConnected] = useState(false);
    const [account, setAccount] = useState('');

    const connectWallet = async () => {
        if (typeof window !== 'undefined' && window.ethereum) {
            try {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    setIsConnected(true);
                }
            } catch (error) {
                console.error('Error connecting wallet:', error);
            }
        } else {
            alert('MetaMask is not installed!');
        }
    };

    return (
        <>
            <Head>
                <title>Quantum DeFi Protocol</title>
                <meta name="description" content="Quantum-Resistant DeFi Protocol" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                {/* Header */}
                <header className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">🌌</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Quantum DeFi Protocol</h1>
                                <p className="text-gray-300 text-sm">Confidential Yield Farming</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            {isConnected ? (
                                <div className="flex items-center space-x-3">
                                    <div className="text-green-400">
                                        ✅ Connected: {account.slice(0, 6)}...{account.slice(-4)}
                                    </div>
                                    <button 
                                        onClick={() => setIsConnected(false)}
                                        className="px-4 py-2 bg-red-600 rounded-lg text-white font-semibold hover:bg-red-700 transition-colors"
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={connectWallet}
                                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                                >
                                    Connect Wallet
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="container mx-auto px-4 pb-12">
                    <div className="text-center py-12">
                        <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
                            The Future of DeFi is Quantum-Resistant
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                            Experience the world's first confidential yield-bearing protocol powered by
                            Fully Homomorphic Encryption and AI optimization.
                        </p>
                        
                        {isConnected ? (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 max-w-md mx-auto">
                                <h3 className="text-green-400 font-semibold text-xl mb-2">🎉 Wallet Connected!</h3>
                                <p className="text-green-300">
                                    Your wallet is successfully connected to the Quantum DeFi Protocol.
                                </p>
                                <p className="text-sm text-gray-400 mt-2">
                                    Account: {account}
                                </p>
                            </div>
                        ) : (
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 max-w-md mx-auto">
                                <h3 className="text-blue-400 font-semibold text-xl mb-2">🔗 Connect Your Wallet</h3>
                                <p className="text-blue-300 mb-4">
                                    Connect your MetaMask wallet to start using the protocol.
                                </p>
                                <button 
                                    onClick={connectWallet}
                                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Connect MetaMask
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                        <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
                            <div className="text-3xl mb-4">🔐</div>
                            <h3 className="text-xl font-bold text-white mb-3">Confidential Yield Farming</h3>
                            <p className="text-gray-300">
                                Stake your tokens with complete privacy. Your amounts and yields remain encrypted using FHE technology.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
                            <div className="text-3xl mb-4">🤖</div>
                            <h3 className="text-xl font-bold text-white mb-3">AI-Powered Optimization</h3>
                            <p className="text-gray-300">
                                Advanced machine learning algorithms optimize your yield strategies on encrypted data.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/30">
                            <div className="text-3xl mb-4">⚛️</div>
                            <h3 className="text-xl font-bold text-white mb-3">Quantum-Resistant Security</h3>
                            <p className="text-gray-300">
                                Future-proof cryptography using lattice-based algorithms resistant to quantum attacks.
                            </p>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-700/50 py-8">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-gray-400">
                            Built with ❤️ by the Quantum DeFi Community |
                            <span className="text-purple-400 ml-2">The future of DeFi is quantum-resistant, AI-powered, and cross-chain.</span>
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
