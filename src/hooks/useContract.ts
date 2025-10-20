import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { CipherKindGlowABI } from '../lib/contract';
import { useZamaInstance } from './useZamaInstance';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x20197a609e36bd5a3B762F5Fdd973b9185B1144c'; // Replace with deployed contract address

export const useCreateCampaign = () => {
  const { writeContractAsync, isPending, error } = useWriteContract();
  const { instance } = useZamaInstance();
  const { address } = useAccount();

  const createCampaign = async (title: string, description: string, targetAmount: number) => {
    if (!instance || !address) {
      throw new Error('FHE instance or wallet not available');
    }

    try {
      // Create encrypted input for target amount
      const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
      input.add32(BigInt(targetAmount));
      const encryptedInput = await input.encrypt();

      // Convert Uint8Array handles to 32-byte hex strings
      const convertToBytes32 = (handle: Uint8Array): string => {
        const hex = `0x${Array.from(handle)
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')}`;
        if (hex.length < 66) {
          return hex.padEnd(66, '0');
        } else if (hex.length > 66) {
          return hex.substring(0, 66);
        }
        return hex;
      };

      const targetAmountHandle = convertToBytes32(encryptedInput.handles[0]);
      const proof = `0x${Array.from(encryptedInput.inputProof as Uint8Array)
        .map(b => b.toString(16).padStart(2, '0')).join('')}`;

      return await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CipherKindGlowABI,
        functionName: 'createCampaign',
        args: [title, description, targetAmountHandle, proof],
      } as any);
    } catch (err) {
      console.error('Error creating campaign:', err);
      throw err;
    }
  };

  return { createCampaign, isLoading: isPending, error };
};

export const useMakeDonation = () => {
  const { writeContractAsync, isPending, error } = useWriteContract();
  const { instance } = useZamaInstance();
  const { address } = useAccount();

  const makeDonation = async (campaignId: string, amount: number) => {
    console.log('💰 Starting donation process:', { campaignId, amount, instance: !!instance, address });
    
    if (!instance || !address) {
      throw new Error('FHE instance or wallet not available');
    }

    try {
      console.log('🔐 Creating encrypted input for donation...');
      // Create encrypted input for donation amount
      const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
      input.add32(BigInt(amount));
      const encryptedInput = await input.encrypt();
      console.log('✅ Encrypted input created:', { handles: encryptedInput.handles.length });

      // Convert Uint8Array handles to 32-byte hex strings like aidwell-connect
      const convertToBytes32 = (handle: Uint8Array): string => {
        const hex = `0x${Array.from(handle)
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')}`;
        // Ensure exactly 32 bytes (66 characters including 0x)
        if (hex.length < 66) {
          return hex.padEnd(66, '0');
        } else if (hex.length > 66) {
          return hex.substring(0, 66);
        }
        return hex;
      };

      const amountHandle = convertToBytes32(encryptedInput.handles[0]);
      const proof = `0x${Array.from(encryptedInput.inputProof as Uint8Array)
        .map(b => b.toString(16).padStart(2, '0')).join('')}`;

      // Convert campaignId to bytes32 format
      const campaignIdBytes32 = campaignId.startsWith('0x') ? campaignId : `0x${campaignId}`;
      
      console.log('📝 Calling smart contract makeDonation...');
      console.log('📊 Contract details:', {
        address: CONTRACT_ADDRESS,
        functionName: 'makeDonation',
        args: [campaignIdBytes32, amountHandle, proof]
      });
      
      console.log('🔍 Parameter details:', {
        campaignIdBytes32: campaignIdBytes32,
        campaignIdBytes32Type: typeof campaignIdBytes32,
        amountHandle: amountHandle,
        amountHandleType: typeof amountHandle,
        proof: proof,
        proofType: typeof proof,
        proofLength: proof.length
      });
      
      // Use writeContractAsync like aidwell-connect
      const result = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CipherKindGlowABI,
        functionName: 'makeDonation',
        args: [campaignIdBytes32 as `0x${string}`, amountHandle, proof],
      } as any);
      
      console.log('🎉 Donation transaction submitted:', result);
      return result;
    } catch (writeError) {
      console.error('❌ writeContractAsync error:', writeError);
      console.error('Error type:', typeof writeError);
      console.error('Error message:', writeError?.message);
      console.error('Error code:', writeError?.code);
      throw writeError;
    }
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
