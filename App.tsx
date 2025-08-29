import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';
import { ThemeProvider } from './src/theme/ThemeProvider';

const Tab = createBottomTabNavigator();

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
        <Tab.Navigator>
          <Tab.Screen name="Feed" component={() => <Screen title="Feed" />} />
          <Tab.Screen name="Areas" component={() => <Screen title="Areas" />} />
          <Tab.Screen name="Search" component={() => <Screen title="Search" />} />
          <Tab.Screen name="Saved" component={() => <Screen title="Saved" />} />
          <Tab.Screen name="Messaging" component={() => <Screen title="Messaging" />} />
          <Tab.Screen name="Profile" component={() => <Screen title="Profile" />} />
          <Tab.Screen name="Manage" component={() => <Screen title="Manage" />} />
          <Tab.Screen name="Review" component={() => <Screen title="Review" />} />
        </Tab.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
