import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initializeAppData, isAppInitialized } from '../services/storage';

interface AppInitContextType {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

const AppInitContext = createContext<AppInitContextType | undefined>(undefined);

export function AppInitProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Add a minimum delay for smooth splash screen experience
        const minDelay = new Promise<void>((resolve) => setTimeout(resolve, 1500));

        const [, alreadyInitialized] = await Promise.all([
          initializeAppData(),
          isAppInitialized(),
          minDelay,
        ]);

        setIsInitialized(true);
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Failed to initialize app. Please restart.');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  return (
    <AppInitContext.Provider value={{ isInitialized, isLoading, error }}>
      {children}
    </AppInitContext.Provider>
  );
}

export function useAppInit() {
  const context = useContext(AppInitContext);
  if (!context) {
    throw new Error('useAppInit must be used within an AppInitProvider');
  }
  return context;
}
