const hre = require("hardhat");

async function main() {
  console.log("🔗 Registering Sepolia testnet assets...");
  
  try {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Using account:", deployer.address);
    
    // Contract addresses from deployment
    const assetManagerAddress = "0xC4f02385058230bfF47aEa2904446b3d90Eda0F7";
    
    // Get the UniversalAssetManager contract
    const UniversalAssetManager = await hre.ethers.getContractFactory("UniversalAssetManager");
    const assetManager = UniversalAssetManager.attach(assetManagerAddress);
    
    // Sepolia testnet assets
    const assets = [
      {
        address: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8", // Sepolia USDC
        symbol: "USDC",
        decimals: 6,
        chainId: 11155111,
        totalSupply: "1000000000000" // 1M USDC with 6 decimals
      },
      {
        address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14", // Sepolia WETH
        symbol: "WETH",
        decimals: 18,
        chainId: 11155111,
        totalSupply: "1000000000000000000000" // 1000 WETH with 18 decimals
      }
    ];
    
    for (const asset of assets) {
      console.log(`\n📝 Registering ${asset.symbol} on Sepolia...`);
      
      const totalSupply = hre.ethers.BigNumber.from(asset.totalSupply);
      
      const registerTx = await assetManager.registerAsset(
        asset.address,
        asset.chainId,
        asset.symbol,
        asset.decimals,
        totalSupply,
        false // isNative
      );
      
      await registerTx.wait();
      console.log(`✅ ${asset.symbol} registered successfully`);
      console.log(`   Address: ${asset.address}`);
      console.log(`   Chain ID: ${asset.chainId}`);
      console.log(`   Total Supply: ${hre.ethers.utils.formatUnits(totalSupply, asset.decimals)} ${asset.symbol}`);
    }
    
    console.log("\n🎉 All Sepolia assets registered successfully!");
    
  } catch (error) {
    console.error("❌ Asset registration failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
