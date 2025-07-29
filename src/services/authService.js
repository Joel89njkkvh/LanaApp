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
        correo: response.data.correo,
        token: response.data.token
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Credenciales incorrectas'
    };
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await api.post('/auth/register', {
      nombre: name,
      correo: email,
      contraseña: password
    });
    
    return {
      success: true,
      data: {
        id: response.data.id,
        nombre: response.data.nombre,
        correo: response.data.correo,
        token: response.data.token
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