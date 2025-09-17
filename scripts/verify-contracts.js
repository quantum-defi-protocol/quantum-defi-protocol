const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 Verifying contract deployments on Sepolia...");
    
    // Contract addresses from deployment
    const contractAddresses = {
        MockFHE: "0x6Eb1aa06f43ABc12Fa0a838A0521068caA1dD916",
        CrossChainBridge: "0x308f3e0442C5406A4b1c73A65D8f012263468202",
        UniversalAssetManager: "0xA2Dcbc40B8F9191f608C3D9c55d5bb4AEdB7c090",
        ConfidentialYieldProtocol: "0x1C0e279979eBcCC6Eb20220BC7eb7Ac93497d993"
    };

    const provider = ethers.provider;
    
    for (const [name, address] of Object.entries(contractAddresses)) {
        try {
            console.log(`\n📡 Checking ${name} at ${address}...`);
            
            // Check if contract exists
            const code = await provider.getCode(address);
            if (code === "0x") {
                console.log(`❌ ${name}: No contract found at address`);
                continue;
            }
            
            console.log(`✅ ${name}: Contract deployed (${code.length} bytes)`);
            
            // Try to get contract info
            try {
                const contract = await ethers.getContractAt(name, address);
                console.log(`✅ ${name}: Contract interface loaded`);
                
                // Test specific functions for ConfidentialYieldProtocol
                if (name === 'ConfidentialYieldProtocol') {
                    console.log(`🔍 Testing ConfidentialYieldProtocol functions...`);
                    
                    // Check if functions exist
                    const hasSetEncryptedAIParams = typeof contract.setEncryptedAIParams === 'function';
                    const hasCalculateEncryptedYieldRate = typeof contract.calculateEncryptedYieldRate === 'function';
                    const hasConfidentialStake = typeof contract.confidentialStake === 'function';
                    
                    console.log(`  - setEncryptedAIParams: ${hasSetEncryptedAIParams ? '✅' : '❌'}`);
                    console.log(`  - calculateEncryptedYieldRate: ${hasCalculateEncryptedYieldRate ? '✅' : '❌'}`);
                    console.log(`  - confidentialStake: ${hasConfidentialStake ? '✅' : '❌'}`);
                    
                    // Try to call a view function
                    try {
                        const owner = await contract.owner();
                        console.log(`  - owner(): ${owner}`);
                    } catch (error) {
                        console.log(`  - owner() error: ${error.message}`);
                    }
                }
                
            } catch (error) {
                console.log(`❌ ${name}: Failed to load contract interface: ${error.message}`);
            }
            
        } catch (error) {
            console.log(`❌ ${name}: Error checking contract: ${error.message}`);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Verification failed:", error);
        process.exit(1);
    });
