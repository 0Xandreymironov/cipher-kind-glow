import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  console.log("Testing campaign data...");

  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error("CONTRACT_ADDRESS not set in environment");
  }

  const CipherKindGlow = await ethers.getContractFactory("CipherKindGlow");
  const contract = CipherKindGlow.attach(contractAddress);

  // 获取所有campaigns
  console.log("Getting all campaigns...");
  const allCampaigns = await contract.getAllCampaigns();
  console.log("All campaigns:", allCampaigns);

  // 测试第一个campaign
  if (allCampaigns.length > 0) {
    const campaignId = allCampaigns[0];
    console.log("Testing campaign ID:", campaignId);
    
    try {
      const campaign = await contract.getCampaign(campaignId);
      console.log("Campaign data:", campaign);
    } catch (error) {
      console.error("Error getting campaign:", error);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
