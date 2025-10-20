import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Follow fhed-shield-secure: only use UMD global injected via index.html
// Wait for window.RelayerSDK to be ready (in case script loads slightly after React mounts)
const loadRelayer = async () => {
  const get = () => (globalThis as any)?.RelayerSDK;
  let sdk = get();
  if (sdk) return sdk;
  // wait up to 2s
  await new Promise<void>((resolve, reject) => {
    const started = Date.now();
    const t = setInterval(() => {
      sdk = get();
      if (sdk) {
        clearInterval(t);
        resolve();
      } else if (Date.now() - started > 2000) {
        clearInterval(t);
        reject(new Error('RelayerSDK UMD not found'));
      }
    }, 50);
  });
  return get();
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
      const lib = await loadRelayer();
      const { initSDK, createInstance, SepoliaConfig } = pickSDK(lib);
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
