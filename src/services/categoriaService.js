import api from '../api';

export const getCategorias = (tipo) => {
  return api.get(`/categorias/?tipo=${tipo}`);
};
