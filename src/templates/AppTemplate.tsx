import React, { ReactNode } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ScreenTemplate from './ScreenTemplate';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { AppInitProvider, useAppInit } from '../context/AppInitContext';
import SplashScreen from '../screens/SplashScreen';

// Avoid importing `@react-navigation/native` at module-eval time when running
// under Jest (which may not transform ESM in node_modules). Use a conditional
// require so tests can run without needing navigation's ESM build.
let NavigationContainer: any;
const _proc = (globalThis as any).process;
const isJest = typeof _proc !== 'undefined' && (_proc.JEST_WORKER_ID !== undefined || _proc.env?.NODE_ENV === 'test');
if (isJest) {
  // simple passthrough for tests
  NavigationContainer = ({ children }: { children: React.ReactNode }) => <>{children}</>;
} else {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  NavigationContainer = require('@react-navigation/native').NavigationContainer;
}
interface AppTemplateProps {
  children: ReactNode;
}

// Inner component that uses the AppInit context
function AppContent({ children }: AppTemplateProps) {
  const { isLoading, error } = useAppInit();

  if (isLoading) {
    return <SplashScreen />;
  }

  if (error) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <ScreenTemplate>{children}</ScreenTemplate>
    </NavigationContainer>
  );
}

export default function AppTemplate(props: AppTemplateProps) {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppInitProvider>
          <AuthProvider>
            <CartProvider>
              <FavoritesProvider>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                <AppContent>{props.children}</AppContent>
              </FavoritesProvider>
            </CartProvider>
          </AuthProvider>
        </AppInitProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}