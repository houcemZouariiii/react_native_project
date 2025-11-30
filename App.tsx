import React from 'react';
import AppTemplate from './src/templates/AppTemplate';
import { View, Text } from 'react-native';
import AppNavigation from './src/Navigation/AppNAvigation';
function App() {
  return (
    
    <AppTemplate>
      <AppNavigation />
    </AppTemplate>
  );
}

export default App;