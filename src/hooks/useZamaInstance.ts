import { useState, useEffect } from 'react';
import { createInstance, initSDK, SepoliaConfig } from '@zama-fhe/relayer-sdk/bundle';
import { useAccount } from 'wagmi';

export function useZamaInstance() {
  const [instance, setInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { isConnected } = useAccount();

  const initializeZama = async () => {
    if (isLoading || isInitialized) return;

    try {
      console.log('🚀 Starting Zama initialization...');
      setIsLoading(true);
      setError(null);

      // Check if ethereum provider is available
      if (!(window as any).ethereum) {
        console.log('⚠️ Ethereum provider not found, waiting for wallet connection...');
        setError('Ethereum provider not found. Please connect your wallet first.');
        return;
      }

      console.log('🔄 Step 1: Initializing SDK...');
      await initSDK();
      console.log('✅ SDK initialized successfully');

      console.log('🔄 Step 2: Creating Zama instance...');
      const config = {
        ...SepoliaConfig,
        network: (window as any).ethereum
      };

      console.log('📊 Config:', config);
      const zamaInstance = await createInstance(config);
      console.log('✅ Zama instance created successfully');
      
      setInstance(zamaInstance);
      setIsInitialized(true);
      console.log('🎉 Zama initialization completed!');

    } catch (err) {
      console.error('❌ Failed to initialize Zama instance:', err);
      setError(`Failed to initialize encryption service: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔄 Wallet connection status changed:', { isConnected, isInitialized });
    if (isConnected && !isInitialized && !isLoading) {
      console.log('🔄 Wallet connected, initializing Zama...');
      initializeZama();
    }
  }, [isConnected, isInitialized, isLoading]);

  return {
    instance,
    isLoading,
    error,
    isInitialized,
    initializeZama
  };
}
