// src/services/authService.js
import api from './api';

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      correo: email,
      contraseña: password
    });
    
    return {
      success: true,
      data: {
        id: response.data.id,
        nombre: response.data.nombre,
        correo: response.data.correo
        // ❌ Eliminado: token: response.data.token (no existe en tu API)
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Credenciales incorrectas'
    };
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/registro', { // ← Nota: cambié a '/auth/registro' para coincidir con tu LoginScreen
      nombre: userData.nombre,
      correo: userData.correo,
      contraseña: userData.contraseña
    });
    
    return {
      success: true,
      data: {
        id: response.data.id,
        nombre: response.data.nombre,
        correo: response.data.correo
        // ❌ Eliminado: token: response.data.token (no existe en tu API)
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Error al registrarse'
    };
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Error al verificar sesión'
    };
  }
};