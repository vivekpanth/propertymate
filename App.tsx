import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { SearchScreen } from './src/features/search/SearchScreen';
import { SignInScreen } from './src/features/auth/SignInScreen';

const Tab = createBottomTabNavigator();
import { supabase } from './src/services/supabase';





function Screen({ title }: { title: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{title}</Text>
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer theme={DefaultTheme}>
        <StatusBar style="auto" />
        <Tab.Navigator screenOptions={{ lazy: false }}>
          <Tab.Screen name="Feed">{() => <Screen title="Feed" />}</Tab.Screen>
          <Tab.Screen name="Areas">{() => <Screen title="Areas" />}</Tab.Screen>
          <Tab.Screen name="Search">{() => <SearchScreen />}</Tab.Screen>
          <Tab.Screen name="Saved">{() => <Screen title="Saved" />}</Tab.Screen>
          <Tab.Screen name="Messaging">{() => <Screen title="Messaging" />}</Tab.Screen>
          <Tab.Screen name="Profile">{() => <Screen title="Profile" />}</Tab.Screen>
          <Tab.Screen name="Manage">{() => <Screen title="Manage" />}</Tab.Screen>
          <Tab.Screen name="Review">{() => <Screen title="Review" />}</Tab.Screen>
          <Tab.Screen name="SignIn">{() => <SignInScreen />}</Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
