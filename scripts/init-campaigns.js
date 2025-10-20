import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  console.log("Initializing campaigns...");

  // 获取合约实例
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error("CONTRACT_ADDRESS not set in environment");
  }

  const CipherKindGlow = await ethers.getContractFactory("CipherKindGlow");
  const contract = CipherKindGlow.attach(contractAddress);

  // 初始化FHE
  const hre = await import("hardhat");
  await hre.default.fhevm.initializeCLIApi();

  const [signer] = await ethers.getSigners();
  console.log("Using signer:", signer.address);

  // 创建3个campaigns
  const campaigns = [
    {
      title: "Clean Water Initiative",
      description: "Bringing safe water to remote communities",
      targetAmount: 10000 // $100.00 in cents
    },
    {
      title: "Education for All",
      description: "Supporting underprivileged children's education",
      targetAmount: 15000 // $150.00 in cents
    },
    {
      title: "Climate Action Fund",
      description: "Protecting our planet for future generations",
      targetAmount: 20000 // $200.00 in cents
    }
  ];

  const campaignIds = [];

  for (const campaign of campaigns) {
    console.log(`Creating campaign: ${campaign.title}`);
    
    // 创建加密的目标金额
    const input = hre.default.fhevm.createEncryptedInput(contractAddress, signer.address);
    input.add32(BigInt(campaign.targetAmount));
    const encryptedInput = await input.encrypt();

    // 调用合约创建campaign
    const tx = await contract.createCampaign(
      campaign.title,
      campaign.description,
      encryptedInput.handles[0],
      encryptedInput.inputProof
    );

    const receipt = await tx.wait();
    console.log(`Campaign created: ${campaign.title}`);
    console.log(`Transaction hash: ${receipt.hash}`);

    // 从事件中获取campaign ID
    const event = receipt.logs.find(log => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed.name === 'CampaignCreated';
      } catch (e) {
        return false;
      }
    });

    if (event) {
      const parsed = contract.interface.parseLog(event);
      campaignIds.push(parsed.args.campaignId);
      console.log(`Campaign ID: ${parsed.args.campaignId}`);
    }
  }

  console.log("\n=== Campaign Initialization Complete ===");
  console.log("Campaign IDs:", campaignIds);
  console.log("Contract Address:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
