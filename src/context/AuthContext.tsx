import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { getUser, saveUser } from '../services/storage';
import { getRandomAvatar } from '../data/seedData';

const ONBOARDING_KEY = '@coffee_shop_onboarding_complete';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  hasSeenOnboarding: boolean;
  login: (name: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updateAvatar: (avatar: string) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
  incrementOrders: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const [savedUser, onboardingComplete] = await Promise.all([
        getUser(),
        AsyncStorage.getItem(ONBOARDING_KEY),
      ]);
      setUser(savedUser);
      setHasSeenOnboarding(onboardingComplete === 'true');
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      setHasSeenOnboarding(true);
    } catch (error) {
      console.error('Error saving onboarding state:', error);
    }
  };

  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
      setHasSeenOnboarding(false);
    } catch (error) {
      console.error('Error resetting onboarding state:', error);
    }
  };

  const isLoggedIn = user?.isLoggedIn ?? false;

  const login = async (name: string, email: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      avatar: getRandomAvatar(),
      isLoggedIn: true,
      ordersCount: 0,
      points: 0,
    };
    setUser(newUser);
    await saveUser(newUser);
  };

  const logout = async () => {
    if (user) {
      const loggedOutUser = { ...user, isLoggedIn: false };
      setUser(loggedOutUser);
      await saveUser(loggedOutUser);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      await saveUser(updatedUser);
    }
  };

  const updateAvatar = async (avatar: string) => {
    if (user) {
      const updatedUser = { ...user, avatar };
      setUser(updatedUser);
      await saveUser(updatedUser);
    }
  };

  const incrementOrders = async () => {
    if (user) {
      const updatedUser = {
        ...user,
        ordersCount: (user.ordersCount || 0) + 1,
        points: (user.points || 0) + 20, // 20 points per order
      };
      setUser(updatedUser);
      await saveUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn,
        hasSeenOnboarding,
        login,
        logout,
        updateProfile,
        updateAvatar,
        completeOnboarding,
        resetOnboarding,
        incrementOrders,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
