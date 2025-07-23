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
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.primary,
        tabBarStyle: { backgroundColor: colors.background },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="speedometer" color={color} size={size} />
          ),
          title: 'Dashboard',
        }}
      />
      <Tab.Screen
        name="Transaccion"
        component={TransaccionesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="menu" color={color} size={size} />
          ),
          title: 'Transacciones',
        }}
      />
      <Tab.Screen
        name="Finanzas"
        component={FinanzasScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="trending-up" color={color} size={size} />
          ),
          title: 'Finanzas',
        }}
      />
      <Tab.Screen
        name="Presupuesto"
        component={PresupuestosScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="scale-balance" color={color} size={size} />
          ),
          title: 'Presupuestos',
        }}
      />
    </Tab.Navigator>
  );
}