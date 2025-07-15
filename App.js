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
import PerfilScreen from './src/screens/PerfilScreen';


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
          options={{headerShown: false}} 
        />

        <Stack.Screen
          name='Transaccion'
          component={TransaccionesScreen}
          options={{headerShown: false}} 
        />

        <Stack.Screen
          name='Finanzas'
          component={FinanzasScreen}
          options={{headerShown: false}} 
        />

        <Stack.Screen
          name='Presupuesto'
          component={PresupuestosScreen}
          options={{headerShown: false}} 
        />

        <Stack.Screen
          name='Perfil'
          component={PerfilScreen}
          options={{headerShown: false}} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
