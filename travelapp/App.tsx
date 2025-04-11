import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './nav/appnav';
import { GlobalProvider } from './context/globalcontext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <GlobalProvider>
          <AppNavigator />
      </GlobalProvider>
    </SafeAreaProvider>
  );
}