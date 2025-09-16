import React, { useState } from 'react';
import Head from 'next/head';
import SimpleConfidentialYield from '../components/SimpleConfidentialYield';
import CrossChainInterface from '../components/CrossChainInterface';

export default function Home() {
    const [activeTab, setActiveTab] = useState('confidential');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
            <Head>
                <title>Quantum DeFi Protocol - Confidential Yield Farming</title>
                <meta name="description" content="Quantum-resistant DeFi protocol with AI-powered yield optimization and FHE encryption" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Header */}
            <header className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">Q</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                    Quantum DeFi Protocol
                                </h1>
                                <p className="text-gray-400 text-sm">Confidential Yield Farming</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                                🔒 FHE Enabled
                            </span>
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                                🤖 AI Powered
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1 mb-8">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${activeTab === 'overview'
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                            }`}
                    >
                        📊 Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('confidential')}
                        className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${activeTab === 'confidential'
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                            }`}
                    >
                        🔐 Confidential Yield
                    </button>
                    <button
                        onClick={() => setActiveTab('crosschain')}
                        className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${activeTab === 'crosschain'
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                            }`}
                    >
                        🌐 Cross-Chain
                    </button>
                    <button
                        onClick={() => setActiveTab('features')}
                        className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${activeTab === 'features'
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                            }`}
                    >
                        ⚡ Features
                    </button>
                </div>

                {/* Tab Content */}
                <div className="pb-16">
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            <div className="text-center">
                                <h2 className="text-4xl font-bold text-white mb-4">
                                    Welcome to Quantum DeFi Protocol
                                </h2>
                                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                    The future of decentralized finance with quantum-resistant cryptography,
                                    fully homomorphic encryption, and AI-powered yield optimization.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
                                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6">
                                        <span className="text-2xl">🔐</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4">FHE Encryption</h3>
                                    <p className="text-gray-300">
                                        Your financial data remains private with fully homomorphic encryption.
                                        Calculations happen on encrypted data without revealing your balances.
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                                        <span className="text-2xl">🤖</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4">AI Optimization</h3>
                                    <p className="text-gray-300">
                                        Advanced machine learning algorithms optimize your yield farming strategies
                                        while maintaining complete privacy of your data.
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30">
                                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-6">
                                        <span className="text-2xl">⚛️</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4">Quantum-Resistant</h3>
                                    <p className="text-gray-300">
                                        Built with quantum-resistant cryptography to protect your assets
                                        from future quantum computing threats.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'confidential' && <SimpleConfidentialYield />}


                    {activeTab === 'crosschain' && <CrossChainInterface />}

                    {activeTab === 'features' && (
                        <div className="space-y-8">
                            <div className="text-center">
                                <h2 className="text-4xl font-bold text-white mb-4">
                                    Advanced Features
                                </h2>
                                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                    Explore the cutting-edge capabilities of our quantum-resistant DeFi protocol.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
                                    <h3 className="text-2xl font-bold text-white mb-6">🔒 Privacy Features</h3>
                                    <ul className="space-y-4 text-gray-300">
                                        <li className="flex items-start space-x-3">
                                            <span className="text-purple-400 mt-1">•</span>
                                            <span>Fully Homomorphic Encryption for all calculations</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-purple-400 mt-1">•</span>
                                            <span>Zero-knowledge proof integration</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-purple-400 mt-1">•</span>
                                            <span>Private transaction routing</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-purple-400 mt-1">•</span>
                                            <span>Confidential smart contracts</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
                                    <h3 className="text-2xl font-bold text-white mb-6">🤖 AI Capabilities</h3>
                                    <ul className="space-y-4 text-gray-300">
                                        <li className="flex items-start space-x-3">
                                            <span className="text-blue-400 mt-1">•</span>
                                            <span>Dynamic yield optimization algorithms</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-blue-400 mt-1">•</span>
                                            <span>Risk assessment and management</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-blue-400 mt-1">•</span>
                                            <span>Market trend analysis</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-blue-400 mt-1">•</span>
                                            <span>Automated rebalancing strategies</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30">
                                    <h3 className="text-2xl font-bold text-white mb-6">⚛️ Quantum Security</h3>
                                    <ul className="space-y-4 text-gray-300">
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 mt-1">•</span>
                                            <span>Lattice-based cryptography</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 mt-1">•</span>
                                            <span>Post-quantum signature schemes</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 mt-1">•</span>
                                            <span>Quantum key distribution</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-green-400 mt-1">•</span>
                                            <span>Future-proof security protocols</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/30">
                                    <h3 className="text-2xl font-bold text-white mb-6">🌐 Cross-Chain</h3>
                                    <ul className="space-y-4 text-gray-300">
                                        <li className="flex items-start space-x-3">
                                            <span className="text-yellow-400 mt-1">•</span>
                                            <span>Multi-blockchain support</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-yellow-400 mt-1">•</span>
                                            <span>Atomic cross-chain swaps</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-yellow-400 mt-1">•</span>
                                            <span>Interoperability protocols</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="text-yellow-400 mt-1">•</span>
                                            <span>Universal asset management</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}