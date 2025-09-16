import React from 'react';
import Head from 'next/head';

export default function Custom404() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
            <Head>
                <title>404 - Page Not Found | Quantum DeFi Protocol</title>
                <meta name="description" content="The page you are looking for could not be found." />
            </Head>

            <div className="max-w-2xl mx-auto p-8 text-center">
                <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">🔍</span>
                    </div>

                    <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                        404
                    </h1>

                    <h2 className="text-2xl font-bold text-white mb-4">
                        Page Not Found
                    </h2>

                    <p className="text-xl text-gray-300 mb-8">
                        The quantum dimension you're looking for doesn't exist in our protocol.
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold text-white transition-all duration-300 text-lg"
                        >
                            🏠 Return to Home
                        </button>

                        <div className="text-gray-400 text-sm">
                            <p>Or try one of these pages:</p>
                            <div className="mt-2 space-x-4">
                                <a href="/" className="text-purple-400 hover:text-purple-300 underline">
                                    Overview
                                </a>
                                <span className="text-gray-600">•</span>
                                <a href="/" className="text-purple-400 hover:text-purple-300 underline">
                                    Confidential Yield
                                </a>
                                <span className="text-gray-600">•</span>
                                <a href="/" className="text-purple-400 hover:text-purple-300 underline">
                                    Features
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
