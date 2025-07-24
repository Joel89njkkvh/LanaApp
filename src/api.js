// src/api.js
import axios from 'axios';
import { Platform } from 'react-native';

let baseURL = '';

// Detectar entorno
if (Platform.OS === 'web') {
  baseURL = 'http://localhost:8000'; 
} else {
  baseURL = 'http://10.16.38.19:8000'; 
}

const api = axios.create({
  baseURL,
});

export default api;
