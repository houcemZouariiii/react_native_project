import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getFavorites, saveFavorites } from '../services/storage';

interface FavoritesContextType {
  favoriteIds: string[];
  isLoading: boolean;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favorites = await getFavorites();
      setFavoriteIds(favorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFavorite = (productId: string): boolean => {
    return favoriteIds.includes(productId);
  };

  const toggleFavorite = async (productId: string) => {
    const newFavorites = isFavorite(productId)
      ? favoriteIds.filter((id) => id !== productId)
      : [...favoriteIds, productId];

    setFavoriteIds(newFavorites);
    await saveFavorites(newFavorites);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        isLoading,
        isFavorite,
        toggleFavorite,
      }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
