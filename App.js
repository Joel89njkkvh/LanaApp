import React, { useRef, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, Alert } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AgregarTransaccionScreen from './src/screens/AgregarTransaccionScreen';
import PresupuestosScreen from './src/screens/PresupuestosScreen';
import BudgetFormScreen from './src/screens/BudgetFormScreen'; // Importar el formulario
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const { user, loading, error, clearError, setNavigation } = useAuth();
  const navigationRef = useRef();

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK', onPress: clearError }]);
    }
  }, [error, clearError]);

  // Pasar la referencia de navegación al contexto cuando esté lista
  useEffect(() => {
    if (navigationRef.current && setNavigation) {
      setNavigation(navigationRef.current);
    }
  }, [setNavigation]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        // Asegurar que la navegación se pase cuando esté lista
        if (setNavigation) {
          setNavigation(navigationRef.current);
        }
      }}
    >
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={user ? "MainTabs" : "Home"}
      >
        {user ? (
          // Navegación para usuarios autenticados
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen
              name="AgregarTransaccion"
              component={AgregarTransaccionScreen}
              options={{ 
                presentation: 'modal', 
                headerShown: false,
                animation: 'slide_from_bottom'
              }}
            />
            {/* Pantallas de Presupuestos */}
            <Stack.Screen
              name="CreateBudget"
              component={BudgetFormScreen}
              options={{
                headerShown: true,
                title: 'Nuevo Presupuesto',
                headerBackTitle: 'Volver',
                presentation: 'modal',
                animation: 'slide_from_bottom'
              }}
            />
            <Stack.Screen
              name="EditBudget"
              component={BudgetFormScreen}
              options={{
                headerShown: true,
                title: 'Editar Presupuesto',
                headerBackTitle: 'Volver',
                presentation: 'modal',
                animation: 'slide_from_bottom'
              }}
            />
          </>
        ) : (
          // Navegación para usuarios no autenticados
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}