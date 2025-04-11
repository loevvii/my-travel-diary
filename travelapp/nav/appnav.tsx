import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import HomeScreen from '../src/home';
import AddEntryScreen from '../src/entryscreen';
import { GlobalContext } from '../context/globalcontext';

export type RootStackParamList = {
  Home: undefined;
  AddEntry: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isDark } = useContext(GlobalContext);

  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#000',
      card: '#121212',
      text: '#fff',
    },
  };

  const MyLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#fff',
      card: '#f9f9f9',
      text: '#000',
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