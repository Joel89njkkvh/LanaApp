// src/services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

let logoutFunction = null;

const api = axios.create({
  baseURL: 'http://192.168.1.19:5002',
  timeout: 15000,
});

export const setLogoutFunction = (fn) => {
  logoutFunction = fn;
};

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

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