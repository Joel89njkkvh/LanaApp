import axios from 'axios';
import { Platform } from 'react-native';

// Configuración base URL según entorno y plataforma
let baseURL = '';

if (__DEV__) {
  // Entorno de desarrollo
  if (Platform.OS === 'android') {
    baseURL = 'http://192.168.1.19:5002'; // Android en misma red WiFi
  } else if (Platform.OS === 'ios') {
    baseURL = 'http://192.168.1.19:5002'; // iOS en misma red WiFi
  } else if (Platform.OS === 'web') {
    baseURL = 'http://localhost:5002'; // Web (localhost)
  } else {
    baseURL = 'http://localhost:5002'; // Otros casos (por si acaso)
  }
} else {
  // Entorno de producción
  baseURL = 'https://tu-api-en-produccion.com'; // Cambia esta URL por la real de producción
}

const api = axios.create({
  baseURL,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejo global de errores
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la petición:', error.message);
    return Promise.reject(error);
  }
);

export default api;
