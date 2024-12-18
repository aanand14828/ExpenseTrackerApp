// src/navigation/AppNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons'; 
import { COLORS } from '../constants/theme';

import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import TransactionDetailScreen from '../screens/TransactionDetailScreen';
import BudgetsGoalsScreen from '../screens/BudgetsGoalsScreen';

// Define stacks
const HomeStack = createNativeStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Home' }} />
      <HomeStack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ title: 'Add Transaction' }}/>
      <HomeStack.Screen name="TransactionDetail" component={TransactionDetailScreen} options={{ title: 'Transaction Detail' }}/>
    </HomeStack.Navigator>
  );
}

const CategoryStack = createNativeStackNavigator();
function CategoryStackScreen() {
  return (
    <CategoryStack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      <CategoryStack.Screen name="CategoriesMain" component={CategoriesScreen} options={{ title: 'Categories' }} />
    </CategoryStack.Navigator>
  );
}

const BudgetsStack = createNativeStackNavigator();
function BudgetsStackScreen() {
  return (
    <BudgetsStack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      <BudgetsStack.Screen name="BudgetsGoalsMain" component={BudgetsGoalsScreen} options={{ title: 'Budgets & Goals' }} />
    </BudgetsStack.Navigator>
  );
}

// Tab Navigator
const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown:false,
        tabBarIcon: ({ color, size }) => {
          let iconName = 'wallet-outline';

          if (route.name === 'Home') {
            iconName = 'wallet-outline';
          } else if (route.name === 'Categories') {
            iconName = 'list-circle-outline';
          } else if (route.name === 'Budgets & Goals') {
            iconName = 'bar-chart-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textSecondary
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen}/>
      <Tab.Screen name="Categories" component={CategoryStackScreen}/>
      <Tab.Screen name="Budgets & Goals" component={BudgetsStackScreen}/>
    </Tab.Navigator>
  );
}