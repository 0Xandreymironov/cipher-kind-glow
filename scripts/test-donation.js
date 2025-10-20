import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  console.log("Testing donation process...");

  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error("CONTRACT_ADDRESS not set in environment");
  }

  const CipherKindGlow = await ethers.getContractFactory("CipherKindGlow");
  const contract = CipherKindGlow.attach(contractAddress);

  // 获取第一个campaign
  const allCampaigns = await contract.getAllCampaigns();
  console.log("Available campaigns:", allCampaigns);

  if (allCampaigns.length > 0) {
    const campaignId = allCampaigns[0];
    console.log("Testing with campaign ID:", campaignId);
    
    // 获取campaign信息
    const campaign = await contract.getCampaign(campaignId);
    console.log("Campaign info:", campaign);
    
    // 检查campaign是否活跃
    console.log("Campaign is active:", campaign[4]); // isActive field
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
