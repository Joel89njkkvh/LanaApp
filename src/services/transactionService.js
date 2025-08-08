import api from '../api';

export const getTransactions = (usuario_id) => {
  return api.get('/transacciones', {
    params: { usuario_id }
  });
};
export const createTransaction = (usuario_id, data) => {
  return api.post(`/transacciones/?usuario_id=${usuario_id}`, data);
};
export const updateTransaction = (transaccionId, data) => {
  return api.put(`/transacciones/${transaccionId}`, data);
};

export const deleteTransaction = (transaccionId) => {
  return api.delete(`/transacciones/${transaccionId}`);
};