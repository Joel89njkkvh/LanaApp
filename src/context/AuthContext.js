import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import api from '../services/api';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [navigationRef, setNavigationRef] = useState(null);
  const [error, setError] = useState(null);

  // Interceptores de axios para manejo global de errores (sin autenticación por token)
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(config => {
      setError(null);
      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      response => response,
      err => {
        setError(err.message);
        // No manejamos logout automático por 401 ya que no usamos tokens
        return Promise.reject(err);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Cargar datos de sesión al iniciar app
  const loadSession = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Guardar datos adicionales para compatibilidad
        await Promise.all([
          AsyncStorage.setItem('usuario_id', parsedUser.id.toString()),
          AsyncStorage.setItem('nombre', parsedUser.nombre),
          AsyncStorage.setItem('correo', parsedUser.correo)
        ]);
        
        console.log('✅ Usuario autenticado:', parsedUser);
      }
    } catch (error) {
      console.error('Error loading session:', error);
      setError('Error al cargar la sesión');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // Guardar datos tras login o registro (sin token)
  const setAuthData = useCallback(async (data) => {
    try {
      console.log('📝 Datos recibidos en setAuthData:', data);

      // Validar que los datos requeridos estén presentes
      if (!data.id || !data.nombre || !data.correo) {
        throw new Error('Datos de usuario incompletos');
      }

      const userData = {
        id: data.id,
        nombre: data.nombre,
        correo: data.correo
      };

      setUser(userData);

      // Guardar datos del usuario (sin token)
      await Promise.all([
        AsyncStorage.setItem('user', JSON.stringify(userData)),
        AsyncStorage.setItem('usuario_id', userData.id.toString()),
        AsyncStorage.setItem('nombre', userData.nombre),
        AsyncStorage.setItem('correo', userData.correo)
      ]);

      console.log('✅ Usuario autenticado:', userData);
    } catch (error) {
      console.error('Error setting auth data:', error);
      setError('Error al guardar los datos de autenticación');
      throw error;
    }
  }, []);

  // Iniciar sesión
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Intentando login con:', { email, password: '***' });

      const result = await authService.login(email, password);
      
      console.log('📥 Respuesta del servicio de login:', result);

      if (!result.success) {
        setError(result.error || 'Error en el login');
        return { success: false, error: result.error };
      }

      await setAuthData(result.data);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = error.isAxiosError && !error.response
        ? 'Error de conexión. Verifica tu red.'
        : error.response?.data?.message || error.message || 'Error en el servidor';

      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [setAuthData]);

  // Cerrar sesión
  const logout = useCallback(async () => {
  try {
    setLoading(true);

    await AsyncStorage.multiRemove([
      'user', 
      'usuario_id', 
      'nombre', 
      'correo'
    ]);

    setUser(null);

    // Eliminar navegación manual aquí

  } catch (error) {
    console.error('Logout error:', error);
    setError('Error al cerrar sesión');
  } finally {
    setLoading(false);
  }
}, []);
  // Registro de usuario
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Intentando registro con:', { ...userData, contraseña: '***' });

      const result = await authService.register(userData);
      
      console.log('📥 Respuesta del servicio de registro:', result);

      if (!result.success) {
        setError(result.error || 'Error en el registro');
        return { success: false, error: result.error };
      }

      await setAuthData(result.data);
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      const errorMsg = error.isAxiosError && !error.response
        ? 'Error de conexión. Verifica tu red.'
        : error.response?.data?.message || error.message || 'Error en el servidor';

      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [setAuthData]);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    setNavigation: (ref) => setNavigationRef(ref),
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};