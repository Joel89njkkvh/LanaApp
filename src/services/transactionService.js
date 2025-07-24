import api from './api';

export const getTransactions = () => api.get('/transactions');

export const createTransaction = (data) => api.post('/transactions', data);