import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { CipherKindGlowABI } from '../lib/contract';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000'; // Replace with deployed contract address

export const useCreateCampaign = () => {
  const { writeContract, isPending, error } = useWriteContract();

  const createCampaign = async (title: string, description: string, encryptedTargetAmount: string) => {
    return writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CipherKindGlowABI,
      functionName: 'createCampaign',
      args: [title, description, encryptedTargetAmount],
    });
  };

  return { createCampaign, isLoading: isPending, error };
};

export const useMakeDonation = () => {
  const { writeContract, isPending, error } = useWriteContract();

  const makeDonation = async (campaignId: string, encryptedAmount: string) => {
    return writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CipherKindGlowABI,
      functionName: 'makeDonation',
      args: [campaignId as `0x${string}`, encryptedAmount],
    });
  };

  return { makeDonation, isLoading: isPending, error };
};

export const useGetCampaigns = () => {
  const { data: campaigns, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CipherKindGlowABI,
    functionName: 'getAllCampaigns',
  });

  return { campaigns, isLoading, error };
};

export const useGetCampaign = (campaignId: string) => {
  const { data: campaign, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CipherKindGlowABI,
    functionName: 'getCampaign',
    args: [campaignId as `0x${string}`],
  });

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
