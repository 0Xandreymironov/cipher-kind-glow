import pkg from "hardhat";
const { ethers } = pkg;

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

  // Verify the deployment
  console.log("Contract deployed successfully!");
  console.log("Contract address:", contractAddress);
  console.log("Network:", await ethers.provider.getNetwork());
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    deployer: (await ethers.getSigners())[0].address,
    timestamp: new Date().toISOString()
  };

  console.log("\nDeployment Information:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  return contractAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });