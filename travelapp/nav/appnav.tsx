import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import HomeScreen from '../src/home';
import AddEntryScreen from '../src/entryscreen';
import { GlobalContext } from '../context/globalcontext'; // Import GlobalContext

export type RootStackParamList = {
  Home: undefined;
  AddEntry: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isDark } = useContext(GlobalContext); // Consume the global theme

  // Define custom themes for light and dark modes
  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#000', // Dark background color
      card: '#121212', // Dark card color
      text: '#fff', // Light text color
    },
  };

  const MyLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#fff', // Light background color
      card: '#f9f9f9', // Light card color
      text: '#000', // Dark text color
    },
  };

  return (
    <NavigationContainer theme={isDark ? MyDarkTheme : MyLightTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? '#121212' : '#f9f9f9', // Header background color
          },
          headerTintColor: isDark ? '#fff' : '#000', // Header text/icon color
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Travel Memories' }} />
        <Stack.Screen name="AddEntry" component={AddEntryScreen} options={{ title: 'Add Entry' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;