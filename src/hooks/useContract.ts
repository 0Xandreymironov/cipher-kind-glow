import { useContract, useContractRead, useContractWrite } from 'wagmi';
import { CipherKindGlowABI } from '../lib/contract';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000'; // Replace with deployed contract address

export const useCipherKindGlow = () => {
  const { data: contract } = useContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CipherKindGlowABI,
  });

  return contract;
};

export const useCreateCampaign = () => {
  const { write, isLoading, error } = useContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CipherKindGlowABI,
    functionName: 'createCampaign',
  });

  return { createCampaign: write, isLoading, error };
};

export const useMakeDonation = () => {
  const { write, isLoading, error } = useContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CipherKindGlowABI,
    functionName: 'makeDonation',
  });

  return { makeDonation: write, isLoading, error };
};

export const useGetCampaigns = () => {
  const { data: campaigns, isLoading, error } = useContractRead({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CipherKindGlowABI,
    functionName: 'getAllCampaigns',
  });

  return { campaigns, isLoading, error };
};

export const useGetCampaign = (campaignId: string) => {
  const { data: campaign, isLoading, error } = useContractRead({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CipherKindGlowABI,
    functionName: 'getCampaign',
    args: [campaignId as `0x${string}`],
  });

  return { campaign, isLoading, error };
};

export const useGetPlatformStats = () => {
  const { data: stats, isLoading, error } = useContractRead({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CipherKindGlowABI,
    functionName: 'getPlatformStats',
  });

  return { stats, isLoading, error };
};
