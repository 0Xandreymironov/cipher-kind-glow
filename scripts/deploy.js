const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying CipherKindGlow contract...");

  // Get the contract factory
  const CipherKindGlow = await ethers.getContractFactory("CipherKindGlow");

  // Deploy the contract
  const cipherKindGlow = await CipherKindGlow.deploy();

  // Wait for deployment to complete
  await cipherKindGlow.waitForDeployment();

  const contractAddress = await cipherKindGlow.getAddress();
  
  console.log("CipherKindGlow deployed to:", contractAddress);
  console.log("Deployment transaction hash:", cipherKindGlow.deploymentTransaction().hash);
  
  // Verify contract on Etherscan (optional)
  console.log("\nTo verify the contract on Etherscan, run:");
  console.log(`npx hardhat verify --network sepolia ${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
