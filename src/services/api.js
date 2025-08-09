// src/services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/apiConfig';

let logoutFunction = null;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setLogoutFunction = (fn) => {
  logoutFunction = fn;
};

// Agrega el token a cada request si existe
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Manejo global de respuestas/errores
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si el backend responde 401, dispara el logout centralizado (si lo configuraste)
    if (error.response?.status === 401 && typeof logoutFunction === 'function') {
      try {
        await logoutFunction();
      } catch (e) {
        // no-op
      }
    }
    // Normaliza el error para que sea más legible aguas arriba
    const normalized = new Error(
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message ||
      'Error de red'
    );
    normalized.status = error.response?.status;
    normalized.data = error.response?.data;
    normalized.config = error.config;
    return Promise.reject(normalized);
  }
);

export default api;
