import React, { ReactNode } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ScreenTemplate from './ScreenTemplate';
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

export default function AppTemplate(props: AppTemplateProps) {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <ScreenTemplate>{props.children}</ScreenTemplate>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}