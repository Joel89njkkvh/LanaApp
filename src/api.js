import axios from 'axios';
import { API_BASE_URL } from './config/apiConfig';


const api = axios.create({
  baseURL: API_BASE_URL,
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
