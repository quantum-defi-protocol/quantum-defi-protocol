import React from 'react';
import Head from 'next/head';

interface ErrorProps {
    statusCode?: number;
    hasGetInitialPropsRun?: boolean;
    err?: Error;
}

function Error({ statusCode, hasGetInitialPropsRun, err }: ErrorProps) {
    if (!hasGetInitialPropsRun && err) {
        // getInitialProps is not called in case of
        // https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
        // err via _app.js so it can be captured
        console.error('Error component received error:', err);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
            <Head>
                <title>Error - Quantum DeFi Protocol</title>
                <meta name="description" content="An error occurred in the Quantum DeFi Protocol" />
            </Head>

            <div className="max-w-2xl mx-auto p-8 text-center">
                <div className="bg-gradient-to-br from-red-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">⚠️</span>
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-4">
                        {statusCode ? `${statusCode} Error` : 'Application Error'}
                    </h1>

                    <p className="text-xl text-gray-300 mb-6">
                        {statusCode === 404
                            ? 'The page you are looking for could not be found.'
                            : 'Something went wrong. Please try again later.'
                        }
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold text-white transition-all duration-300"
                        >
                            🏠 Go Home
                        </button>

                        <button
                            onClick={() => window.location.reload()}
                            className="ml-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-semibold text-white transition-all duration-300"
                        >
                            🔄 Reload Page
                        </button>
                    </div>

                    {process.env.NODE_ENV === 'development' && err && (
                        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg text-left">
                            <h3 className="text-red-400 font-semibold mb-2">Development Error Details:</h3>
                            <pre className="text-gray-300 text-sm overflow-auto">
                                {err.message}
                                {err.stack && `\n\n${err.stack}`}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

Error.getInitialProps = ({ res, err }: any) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode, hasGetInitialPropsRun: true, err };
};

export default Error;
