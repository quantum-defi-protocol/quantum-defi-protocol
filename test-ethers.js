const hre = require("hardhat");

async function test() {
  console.log("Testing ethers connection...");
  
  try {
    console.log("hre object:", typeof hre);
    console.log("hre.ethers:", typeof hre.ethers);
    
    if (hre.ethers && hre.ethers.getSigners) {
      console.log("✅ hre.ethers.getSigners is available");
      const [deployer] = await hre.ethers.getSigners();
      console.log("✅ Successfully got deployer:", deployer.address);
    } else {
      console.log("❌ hre.ethers.getSigners is not available");
      console.log("Available methods:", Object.keys(hre.ethers || {}));
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

test();

