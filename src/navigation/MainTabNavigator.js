import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import TransaccionesScreen from '../screens/TransaccionesScreen';
import FinanzasScreen from '../screens/FinanzasScreen';
import PresupuestosScreen from '../screens/PresupuestosScreen';
import colors from '../config/colors';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { 
          backgroundColor: colors.background,
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="speedometer" color={color} size={24} />
          ),
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tab.Screen
        name="Transacciones"
        component={TransaccionesScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="dollar-sign" color={color} size={24} />
          ),
          tabBarLabel: 'Transacciones',
        }}
      />
      <Tab.Screen
        name="Finanzas"
        component={FinanzasScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="trending-up" color={color} size={24} />
          ),
          tabBarLabel: 'Finanzas',
        }}
      />
      <Tab.Screen
        name="Presupuestos"
        component={PresupuestosScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="wallet-outline" color={color} size={24} />
          ),
          tabBarLabel: 'Presupuestos',
        }}
      />
    </Tab.Navigator>
  );
}
