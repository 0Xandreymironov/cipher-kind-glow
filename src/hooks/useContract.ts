import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { CipherKindGlowABI } from '../lib/contract';
import { useZamaInstance } from './useZamaInstance';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000'; // Replace with deployed contract address

export const useCreateCampaign = () => {
  const { writeContract, isPending, error } = useWriteContract();
  const { instance } = useZamaInstance();
  const { address } = useAccount();

  const createCampaign = async (title: string, description: string, targetAmount: number) => {
    if (!instance || !address) {
      throw new Error('FHE instance or wallet not available');
    }

    // Create encrypted input for target amount
    const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
    input.add32(BigInt(targetAmount));
    const encryptedInput = await input.encrypt();

    return writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CipherKindGlowABI,
      functionName: 'createCampaign',
      args: [title, description, encryptedInput.handles[0], encryptedInput.inputProof],
    });
  };

  return { createCampaign, isLoading: isPending, error };
};

export const useMakeDonation = () => {
  const { writeContract, isPending, error } = useWriteContract();
  const { instance } = useZamaInstance();
  const { address } = useAccount();

  const makeDonation = async (campaignId: string, amount: number) => {
    console.log('💰 Starting donation process:', { campaignId, amount, instance: !!instance, address });
    
    if (!instance || !address) {
      throw new Error('FHE instance or wallet not available');
    }

    console.log('🔐 Creating encrypted input for donation...');
    // Create encrypted input for donation amount
    const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
    input.add32(BigInt(amount));
    const encryptedInput = await input.encrypt();
    console.log('✅ Encrypted input created:', { handles: encryptedInput.handles.length });

    console.log('📝 Calling smart contract makeDonation...');
    const result = await writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CipherKindGlowABI,
      functionName: 'makeDonation',
      args: [campaignId as `0x${string}`, encryptedInput.handles[0], encryptedInput.inputProof],
    });
    
    console.log('🎉 Donation transaction submitted:', result);
    return result;
  };

  return { makeDonation, isLoading: isPending, error };
};

export const useGetCampaigns = () => {
  console.log('🔍 useGetCampaigns called');
  console.log('📊 Contract address:', CONTRACT_ADDRESS);
  
  const { data: campaigns, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CipherKindGlowABI,
    functionName: 'getAllCampaigns',
  });

  console.log('📊 Campaigns data:', { campaigns, isLoading, error });
  
  return { campaigns, isLoading, error };
};

export const useGetCampaign = (campaignId: string) => {
  console.log('🔍 useGetCampaign called:', { campaignId, contractAddress: CONTRACT_ADDRESS });
  
  const { data: rawCampaign, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CipherKindGlowABI,
    functionName: 'getCampaign',
    args: [campaignId as `0x${string}`],
  });

  // Parse the raw campaign data
  const campaign = rawCampaign ? {
    id: rawCampaign[0],
    creator: rawCampaign[1],
    title: rawCampaign[2],
    description: rawCampaign[3],
    isActive: rawCampaign[4],
    createdAt: rawCampaign[5],
    completedAt: rawCampaign[6],
    donorCount: rawCampaign[7]
  } : undefined;

  console.log('📊 Campaign data:', { rawCampaign, campaign, isLoading, error });
  
  return { campaign, isLoading, error };
};

export const useGetPlatformStats = () => {
  const { data: stats, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CipherKindGlowABI,
    functionName: 'getPlatformStats',
  });

  return { stats, isLoading, error };
};

export const useGetCampaignEncryptedData = (campaignId: string) => {
  const { data: encryptedData, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CipherKindGlowABI,
    functionName: 'getCampaignEncryptedData',
    args: [campaignId as `0x${string}`],
  });

  return { encryptedData, isLoading, error };
};
