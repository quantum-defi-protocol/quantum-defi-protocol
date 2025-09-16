import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#8b5cf6" />
                <meta name="description" content="Quantum DeFi Protocol - The future of confidential yield farming with FHE encryption and AI optimization" />
                <meta name="keywords" content="DeFi, cryptocurrency, blockchain, quantum-resistant, FHE, confidential, yield farming, AI" />
                <meta name="author" content="Quantum DeFi Labs" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://quantum-defi-protocol.com/" />
                <meta property="og:title" content="Quantum DeFi Protocol - Confidential Yield Farming" />
                <meta property="og:description" content="The future of DeFi with quantum-resistant cryptography, FHE encryption, and AI-powered yield optimization" />
                <meta property="og:image" content="/og-image.png" />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://quantum-defi-protocol.com/" />
                <meta property="twitter:title" content="Quantum DeFi Protocol - Confidential Yield Farming" />
                <meta property="twitter:description" content="The future of DeFi with quantum-resistant cryptography, FHE encryption, and AI-powered yield optimization" />
                <meta property="twitter:image" content="/og-image.png" />

                {/* Favicon */}
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />

                {/* Fonts */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
                <Component {...pageProps} />
            </div>
        </>
    );
}
