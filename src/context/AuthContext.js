import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import api from '../services/api';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [navigationRef, setNavigationRef] = useState(null);
  const [error, setError] = useState(null);

  // Interceptores de axios para manejo global de errores
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(config => {
      setError(null);
      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      response => response,
      err => {
        setError(err.message);
        if (err.response?.status === 401) {
          logout();
        }
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
      const [storedUser, storedToken] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('token')
      ]);

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        console.log('✅ Usuario cargado correctamente desde AsyncStorage:', parsedUser);
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

  // Guardar datos tras login o registro
  const setAuthData = useCallback(async (data) => {
    try {
      const userData = {
        id: data.id,
        nombre: data.nombre,
        correo: data.correo
      };

      setUser(userData);
      setToken(data.token);

      await Promise.all([
        AsyncStorage.setItem('user', JSON.stringify(userData)),
        AsyncStorage.setItem('token', data.token)
      ]);

      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      console.log('✅ Usuario autenticado y guardado:', userData);
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

      const result = await authService.login(email, password);

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
        : error.response?.data?.message || 'Error en el servidor';

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
      await AsyncStorage.multiRemove(['user', 'token']);
      setUser(null);
      setToken(null);
      delete api.defaults.headers.common['Authorization'];

      if (navigationRef?.current) {
        navigationRef.current.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        );
      }
    } catch (error) {
      console.error('Logout error:', error);
      setError('Error al cerrar sesión');
    } finally {
      setLoading(false);
    }
  }, [navigationRef]);

  // Registro de usuario
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const result = await authService.register(userData);

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
        : error.response?.data?.message || 'Error en el servidor';

      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [setAuthData]);

  const value = {
    user,
    token,
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
