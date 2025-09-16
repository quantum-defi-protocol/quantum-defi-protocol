import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import ConfidentialYieldInterface from '../components/ConfidentialYieldInterface';

export default function Home() {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: '🌌 Overview', icon: '🌌' },
        { id: 'confidential', label: '🔐 Confidential Yield', icon: '🔐' },
        { id: 'features', label: '⚡ Features', icon: '⚡' }
    ];

    return (
        <>
            <Head>
                <title>Quantum DeFi Protocol - The Future of Confidential DeFi</title>
                <meta name="description" content="World's first confidential yield-bearing protocol with FHE encryption and AI optimization" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
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
                            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300">
                                Connect Wallet
                            </button>
                        </div>
                    </div>
                </header>

                {/* Navigation Tabs */}
                <nav className="container mx-auto px-4 mb-8">
                    <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg backdrop-blur-sm">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 px-4 py-3 rounded-md font-medium transition-all duration-300 ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                    }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </nav>

                {/* Main Content */}
                <main className="container mx-auto px-4 pb-12">
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            {/* Hero Section */}
                            <div className="text-center py-12">
                                <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
                                    The Future of DeFi is Quantum-Resistant
                                </h2>
                                <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                                    Experience the world's first confidential yield-bearing protocol powered by
                                    Fully Homomorphic Encryption and AI optimization.
                                </p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <div className="px-6 py-3 bg-green-900/30 rounded-lg border border-green-500/30">
                                        <span className="text-green-400 font-semibold">🔐 Privacy-First</span>
                                    </div>
                                    <div className="px-6 py-3 bg-blue-900/30 rounded-lg border border-blue-500/30">
                                        <span className="text-blue-400 font-semibold">🤖 AI-Powered</span>
                                    </div>
                                    <div className="px-6 py-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
                                        <span className="text-purple-400 font-semibold">⚛️ Quantum-Resistant</span>
                                    </div>
                                    <div className="px-6 py-3 bg-yellow-900/30 rounded-lg border border-yellow-500/30">
                                        <span className="text-yellow-400 font-semibold">⛓️ Cross-Chain</span>
                                    </div>
                                </div>
                            </div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                                <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
                                    <div className="text-3xl mb-4">⛓️</div>
                                    <h3 className="text-xl font-bold text-white mb-3">Cross-Chain Interoperability</h3>
                                    <p className="text-gray-300">
                                        Seamlessly move assets across multiple blockchains with atomic swaps and bridge technology.
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30">
                                    <div className="text-3xl mb-4">🚀</div>
                                    <h3 className="text-xl font-bold text-white mb-3">High Performance</h3>
                                    <p className="text-gray-300">
                                        Optimized smart contracts with efficient gas usage and lightning-fast transactions.
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-pink-900/30 to-red-900/30 backdrop-blur-sm rounded-2xl p-6 border border-pink-500/30">
                                    <div className="text-3xl mb-4">🛡️</div>
                                    <h3 className="text-xl font-bold text-white mb-3">Audited Security</h3>
                                    <p className="text-gray-300">
                                        Comprehensive security audits and formal verification for maximum protection.
                                    </p>
                                </div>
                            </div>

                            {/* Stats Section */}
                            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-600/30">
                                <h3 className="text-2xl font-bold text-white mb-6 text-center">Protocol Statistics</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-purple-400 mb-2">$2.4B+</div>
                                        <div className="text-gray-300">Total Value Locked</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-400 mb-2">156K+</div>
                                        <div className="text-gray-300">Active Users</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-400 mb-2">12+</div>
                                        <div className="text-gray-300">Supported Chains</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-yellow-400 mb-2">24.7%</div>
                                        <div className="text-gray-300">Average APY</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'confidential' && (
                        <ConfidentialYieldInterface />
                    )}

                    {activeTab === 'features' && (
                        <div className="space-y-8">
                            <div className="text-center py-8">
                                <h2 className="text-4xl font-bold text-white mb-4">Advanced Features</h2>
                                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                                    Discover the cutting-edge technologies powering the Quantum DeFi Protocol
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
                                        <h3 className="text-xl font-bold text-white mb-4">🔐 FHE Encryption</h3>
                                        <ul className="space-y-2 text-gray-300">
                                            <li>• Fully Homomorphic Encryption for complete privacy</li>
                                            <li>• Computations on encrypted data without decryption</li>
                                            <li>• Zero-knowledge of user positions</li>
                                            <li>• MEV protection through privacy</li>
                                        </ul>
                                    </div>

                                    <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
                                        <h3 className="text-xl font-bold text-white mb-4">🤖 AI Optimization</h3>
                                        <ul className="space-y-2 text-gray-300">
                                            <li>• Machine learning on encrypted data</li>
                                            <li>• Dynamic yield rate optimization</li>
                                            <li>• Risk assessment algorithms</li>
                                            <li>• Market trend analysis</li>
                                        </ul>
                                    </div>

                                    <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/30">
                                        <h3 className="text-xl font-bold text-white mb-4">⚛️ Quantum Resistance</h3>
                                        <ul className="space-y-2 text-gray-300">
                                            <li>• Lattice-based cryptography</li>
                                            <li>• Post-quantum algorithms</li>
                                            <li>• Future-proof security</li>
                                            <li>• Multi-signature schemes</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
                                        <h3 className="text-xl font-bold text-white mb-4">⛓️ Cross-Chain Bridge</h3>
                                        <ul className="space-y-2 text-gray-300">
                                            <li>• Multi-blockchain support</li>
                                            <li>• Atomic cross-chain transfers</li>
                                            <li>• Liquidity aggregation</li>
                                            <li>• Validator consensus</li>
                                        </ul>
                                    </div>

                                    <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30">
                                        <h3 className="text-xl font-bold text-white mb-4">🚀 High Performance</h3>
                                        <ul className="space-y-2 text-gray-300">
                                            <li>• Optimized gas usage</li>
                                            <li>• Batch operations</li>
                                            <li>• Layer 2 scaling</li>
                                            <li>• Fast finality</li>
                                        </ul>
                                    </div>

                                    <div className="bg-gradient-to-br from-pink-900/30 to-red-900/30 backdrop-blur-sm rounded-2xl p-6 border border-pink-500/30">
                                        <h3 className="text-xl font-bold text-white mb-4">🛡️ Security Features</h3>
                                        <ul className="space-y-2 text-gray-300">
                                            <li>• Multi-signature wallets</li>
                                            <li>• Emergency pause functions</li>
                                            <li>• Audit trail logging</li>
                                            <li>• Flash loan protection</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
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
