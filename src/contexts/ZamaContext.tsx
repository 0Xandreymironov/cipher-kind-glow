import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// On Vercel, ESM import of '@zama-fhe/relayer-sdk/bundle' may fail.
// Prefer the UMD global injected via index.html: window.RelayerSDK
const loadRelayer = async () => {
  const g: any = (globalThis as any);
  if (g.RelayerSDK) {
    return g.RelayerSDK;
  }
  // Fallback to dynamic import for dev/local environments
  try {
    if (import.meta && (import.meta as any).env && (import.meta as any).env.PROD) {
      // On Vercel/production, use CDN ESM directly
      const mod: any = await import(/* @vite-ignore */ 'https://cdn.zama.ai/relayer-sdk-js/0.2.0/relayer-sdk-js.esm.js');
      return mod;
    } else {
      const mod: any = await import('@zama-fhe/relayer-sdk/bundle');
      return mod;
    }
  } catch (e) {
    console.error('Failed to load relayer SDK module. Ensure CDN script is included in index.html.', e);
    throw e;
  }
};

interface ZamaContextType {
  instance: any;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  initializeZama: () => Promise<void>;
}

const ZamaContext = createContext<ZamaContextType | undefined>(undefined);

export const useZamaContext = () => {
  const context = useContext(ZamaContext);
  if (!context) {
    throw new Error('useZamaContext must be used within a ZamaProvider');
  }
  return context;
};

interface ZamaProviderProps {
  children: ReactNode;
}

export const ZamaProvider = ({ children }: ZamaProviderProps) => {
  const [instance, setInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeZama = async (retryCount = 0) => {
    if (isLoading || isInitialized) return;

    try {
      console.log(`🚀 Starting Zama initialization... (attempt ${retryCount + 1})`);
      setIsLoading(true);
      setError(null);

      // Check if ethereum provider is available
      if (!(window as any).ethereum) {
        throw new Error('Ethereum provider not found');
      }

      console.log('🔄 Step 1: Initializing SDK...');
      const { initSDK, createInstance, SepoliaConfig } = await loadRelayer();
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
      setIsLoading(false);
      console.log('🎉 Zama initialization completed!');

    } catch (err) {
      console.error('❌ Failed to initialize Zama instance:', err);
      
      // Retry up to 3 times with exponential backoff
      if (retryCount < 3) {
        console.log(`🔄 Retrying in ${(retryCount + 1) * 1000}ms...`);
        setTimeout(() => {
          initializeZama(retryCount + 1);
        }, (retryCount + 1) * 1000);
      } else {
        setError('Failed to initialize encryption service. Please refresh the page and try again.');
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    console.log('🔄 Initializing Zama on provider mount...');
    initializeZama();
  }, []);

  // Debug logging
  console.log('🔍 ZamaContext state:', { instance: !!instance, isLoading, isInitialized, error });

  return (
    <ZamaContext.Provider value={{
      instance,
      isLoading,
      error,
      isInitialized,
      initializeZama
    }}>
      {children}
    </ZamaContext.Provider>
  );
};
