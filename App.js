import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

import DashboardScreen from './src/screens/DashboardScreen';
import IncomeScreen from './src/screens/IncomeScreen';
import ExpenseScreen from './src/screens/ExpenseScreen';
import BudgetScreen from './src/screens/BudgetScreen';
import TipsScreen from './src/screens/TipsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            tabBarIcon: ({ color }) => <TabIcon emoji="🏠" color={color} />,
          }}
        />
        <Tab.Screen
          name="Income"
          component={IncomeScreen}
          options={{
            tabBarIcon: ({ color }) => <TabIcon emoji="💰" color={color} />,
          }}
        />
        <Tab.Screen
          name="Expenses"
          component={ExpenseScreen}
          options={{
            tabBarIcon: ({ color }) => <TabIcon emoji="💸" color={color} />,
          }}
        />
        <Tab.Screen
          name="Budget"
          component={BudgetScreen}
          options={{
            tabBarIcon: ({ color }) => <TabIcon emoji="🎯" color={color} />,
          }}
        />
        <Tab.Screen
          name="Tips"
          component={TipsScreen}
          options={{
            tabBarIcon: ({ color }) => <TabIcon emoji="💡" color={color} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Simple text-based icon component
function TabIcon({ emoji, color }) {
  return (
    <Text style={{ fontSize: 24, color }}>
      {emoji}
    </Text>
  );
}
