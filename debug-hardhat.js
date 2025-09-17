const hre = require("hardhat");

async function debug() {
  console.log("🔍 Debugging Hardhat environment...");
  
  console.log("hre type:", typeof hre);
  console.log("hre keys:", Object.keys(hre));
  
  console.log("\nhre.ethers type:", typeof hre.ethers);
  if (hre.ethers) {
    console.log("hre.ethers keys:", Object.keys(hre.ethers));
  }
  
  console.log("\nhre.network:", hre.network);
  console.log("hre.config:", typeof hre.config);
  
  // Try different ways to access ethers
  console.log("\n🔍 Trying different ethers access methods...");
  
  try {
    const { ethers } = require("hardhat");
    console.log("✅ require('hardhat').ethers:", typeof ethers);
    if (ethers && ethers.getSigners) {
      console.log("✅ ethers.getSigners available");
    }
  } catch (e) {
    console.log("❌ require('hardhat').ethers failed:", e.message);
  }
  
  try {
    const ethers = hre.ethers;
    console.log("✅ hre.ethers:", typeof ethers);
    if (ethers && ethers.getSigners) {
      console.log("✅ hre.ethers.getSigners available");
    }
  } catch (e) {
    console.log("❌ hre.ethers failed:", e.message);
  }
  
  // Check if we can get network info
  console.log("\n🌐 Network information:");
  console.log("Network name:", hre.network.name);
  console.log("Network config:", hre.network.config);
}

debug().catch(console.error);
