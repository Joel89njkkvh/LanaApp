import api from './api';

export const login = (email, password) =>
  api.post('/auth/login', {
    correo: email,
    contraseña: password,
  });

export const register = (name, email, password) =>
  api.post('/auth/register', {
    nombre: name,
    correo: email,
    contraseña: password,
  });

export const getCurrentUser = () => api.get('/auth/me');