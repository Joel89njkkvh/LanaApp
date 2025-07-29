// src/api.js
import axios from 'axios';
import { Platform } from 'react-native';

let baseURL = '';

// Detectar entorno
if (Platform.OS === 'web') {
  baseURL = 'http://localhost:5002';
} else {
  baseURL = 'http://192.168.1.19:5002';
}

const api = axios.create({
  baseURL,
});

export default api;
