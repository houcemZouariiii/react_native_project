import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import PublicNavigation from './PublicNavigation';
import MainNavigation from './MainNavigation';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

export default function AppNavigation() {
  const { isLoggedIn, isLoading, hasSeenOnboarding, completeOnboarding } = useAuth();
  const { isDarkMode } = useTheme();
  const [showSplash, setShowSplash] = useState(true);

  const backgroundColor = isDarkMode ? '#1a1a2e' : '#FFFFFF';

  // Show splash screen for 1.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen />;
  }

  // Show loading while auth state is being determined
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor }}>
        <ActivityIndicator size="large" color="#2D5A3D" />
      </View>
    );
  }

  // Show onboarding for first-time users
  if (!hasSeenOnboarding) {
    return <OnboardingScreen onComplete={completeOnboarding} />;
  }

  // Show main navigation if logged in, otherwise show login
  if (isLoggedIn) {
    return <MainNavigation />;
  }

  return <PublicNavigation />;
}