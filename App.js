import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import TransaccionesScreen from './src/screens/TransaccionesScreen';
import FinanzasScreen from './src/screens/FinanzasScreen';
import PresupuestosScreen from './src/screens/PresupuestosScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="home">
        <Stack.Screen
          name="home"
          component={HomeScreen}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Iniciar sesión' }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Registro' }}
        />
        <Stack.Screen
          name='Dashboard'
          component={DashboardScreen}
          options={{title: 'Dashboard'}} 
        />

        <Stack.Screen
          name='Transaccion'
          component={TransaccionesScreen}
          options={{title: 'Transaccion'}} 
        />

        <Stack.Screen
          name='Finanzas'
          component={FinanzasScreen}
          options={{title: 'Finanzas'}} 
        />

        <Stack.Screen
          name='Presupuesto'
          component={PresupuestosScreen}
          options={{title: 'Presupuesto'}} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
