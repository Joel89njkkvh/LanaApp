import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, FontAwesome5, Ionicons, Entypo } from '@expo/vector-icons';

import DashboardScreen from '../screens/DashboardScreen';
import TransaccionesScreen from '../screens/TransaccionesScreen';
import FinanzasScreen from '../screens/FinanzasScreen';
import PresupuestosScreen from '../screens/PresupuestosScreen';
import PagosScreen from '../screens/PagosScreen';
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
          elevation: 4,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="view-dashboard-outline" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Transacciones"
        component={TransaccionesScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="exchange-alt" color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="Finanzas"
        component={FinanzasScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="bar-chart-outline" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Presupuestos"
        component={PresupuestosScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Entypo name="wallet" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="PagosScreen"
        component={PagosScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="credit-card-outline" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
