// src/services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

let logoutFunction = null;

// Solo la IP, sin http:// y sin puerto
const LOCAL_IP = '10.16.33.38';
const PORT = '8000';

const baseURL =
  Platform.OS === 'android'
    ? `http://${LOCAL_IP}:${PORT}`
    : `http://${LOCAL_IP}:${PORT}`;

const api = axios.create({
  baseURL,
  timeout: 15000,
});

export const setLogoutFunction = (fn) => {
  logoutFunction = fn;
};

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && logoutFunction) {
      await logoutFunction();
    }
    return Promise.reject(error);
  }
);

export default api;
