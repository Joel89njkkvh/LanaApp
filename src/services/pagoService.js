// services/pagosService.js
import { API_BASE_URL } from '../config/apiConfig';

class PagosService {
  
  getCategoryIdByName(nombre) {
    const categoryMapping = {
      'Alimentos': 1,
      'Transporte': 2,
      'Vivienda': 3,
      'Entretenimiento': 4,
      'Salud': 5,
      'Educación': 6,
      'Salario': 7,
      'Bonos': 8,
      'Inversiones': 9,
      'Otros ingresos': 10
    };
    
    return categoryMapping[nombre] || null;
  }

  // Obtener todos los pagos de un usuario
  async getPayments(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/pagos?usuario_id=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error obteniendo pagos:', error);
      throw error;
    }
  }

  // Crear un nuevo pago
  async createPayment(paymentData) {
    try {
      // Extraer usuario_id para enviarlo como query parameter
      const { usuario_id, ...bodyData } = paymentData;
      
      if (!usuario_id) {
        throw new Error('usuario_id es requerido');
      }

      console.log('usuario_id (query param):', usuario_id);
      console.log('Datos del cuerpo:', JSON.stringify(bodyData, null, 2));
      
      const response = await fetch(`${API_BASE_URL}/pagos?usuario_id=${usuario_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      console.log('URL:', `${API_BASE_URL}/pagos?usuario_id=${usuario_id}`);
      console.log('Respuesta del servidor:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error del servidor:', errorData);
        throw new Error(`Error HTTP: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creando pago:', error);
      throw error;
    }
  }

  // Actualizar un pago existente
  async updatePayment(paymentId, paymentData) {
    try {
      // Extraer usuario_id para enviarlo como query parameter si es necesario
      const { usuario_id, ...bodyData } = paymentData;
      
      console.log('Actualizando pago ID:', paymentId);
      console.log('Datos del cuerpo:', JSON.stringify(bodyData, null, 2));
      
      // Para actualizar, puede que no necesite el usuario_id en la URL, pero lo incluimos por consistencia
      const url = usuario_id 
        ? `${API_BASE_URL}/pagos/${paymentId}?usuario_id=${usuario_id}`
        : `${API_BASE_URL}/pagos/${paymentId}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      console.log('URL:', url);
      console.log('Respuesta del servidor:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error del servidor:', errorData);
        throw new Error(`Error HTTP: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error actualizando pago:', error);
      throw error;
    }
  }

  // Eliminar un pago
  async deletePayment(paymentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/pagos/${paymentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error eliminando pago:', error);
      throw error;
    }
  }

  // Obtener categorías de pagos
  async getCategories() {
    try {
      // Prueba diferentes endpoints posibles
      const possibleEndpoints = [
        `${API_BASE_URL}/categorias`,           // Sin slash final
        `${API_BASE_URL}/categorias/all`,       // Con /all
        `${API_BASE_URL}/categorias/list`,      // Con /list
        `${API_BASE_URL}/api/categorias`,       // Con prefijo /api
      ];

      let data = null;
      let lastError = null;

      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`Probando endpoint: ${endpoint}`);
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            data = await response.json();
            console.log('Categorías recibidas desde:', endpoint, data);
            break;
          }
        } catch (error) {
          lastError = error;
          console.log(`Falló endpoint ${endpoint}:`, error.message);
          continue;
        }
      }

      if (!data) {
        // Si ningún endpoint funciona, usar el método alternativo
        console.log('Ningún endpoint de categorías funciona, usando método alternativo');
        return await this.getCategoriesAlternative();
      }

      // Procesar los datos recibidos y asegurar que tengan IDs consistentes
      if (Array.isArray(data)) {
        const categoriesWithIds = data.map((category) => ({
          ...category,
          id: category.id || this.getCategoryIdByName(category.nombre) || Math.random()
        }));
        return categoriesWithIds;
      } else if (data && Array.isArray(data.data)) {
        const categoriesWithIds = data.data.map((category) => ({
          ...category,
          id: category.id || this.getCategoryIdByName(category.nombre) || Math.random()
        }));
        return categoriesWithIds;
      } else if (data && Array.isArray(data.categorias)) {
        const categoriesWithIds = data.categorias.map((category) => ({
          ...category,
          id: category.id || this.getCategoryIdByName(category.nombre) || Math.random()
        }));
        return categoriesWithIds;
      } else if (data && typeof data === 'object') {
        const categoriesArray = Object.values(data);
        const categoriesWithIds = categoriesArray.map((category) => ({
          ...category,
          id: category.id || this.getCategoryIdByName(category.nombre) || Math.random()
        }));
        return categoriesWithIds;
      } else {
        console.warn('Formato de categorías inesperado:', data);
        return [];
      }
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      // Fallback al método alternativo
      return await this.getCategoriesAlternative();
    }
  }

  // Método alternativo - obtener categorías por rango de IDs conocidos
  async getCategoriesAlternative() {
    try {
      console.log('Usando método alternativo para obtener categorías');
      const categories = [];
      const categoryIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // IDs basados en tu imagen
      
      // Hacer llamadas concurrentes para obtener todas las categorías
      const promises = categoryIds.map(id => this.getCategoryById(id));
      const results = await Promise.allSettled(promises);
      
      // Filtrar solo las categorías que se obtuvieron exitosamente
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          categories.push(result.value);
        }
      });

      console.log(`Categorías obtenidas por método alternativo: ${categories.length}`);
      return categories.sort((a, b) => a.id - b.id); // Ordenar por ID
    } catch (error) {
      console.error('Error en método alternativo:', error);
      return [];
    }
  }

  // Obtener una categoría individual por ID
  async getCategoryById(categoryId) {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias/${categoryId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return null; // No existe esta categoría
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return null; // Error al obtener esta categoría
    }
  }

  // Usar categorías exactas como fallback basadas en tu base de datos
  getCategoriesHardcoded() {
    return [
      { id: 1, nombre: 'Alimentos', tipo: 'egreso' },
      { id: 2, nombre: 'Transporte', tipo: 'egreso' },
      { id: 3, nombre: 'Vivienda', tipo: 'egreso' },
      { id: 4, nombre: 'Entretenimiento', tipo: 'egreso' },
      { id: 5, nombre: 'Salud', tipo: 'egreso' },
      { id: 6, nombre: 'Educación', tipo: 'egreso' },
      { id: 7, nombre: 'Salario', tipo: 'ingreso' },
      { id: 8, nombre: 'Bonos', tipo: 'ingreso' },
      { id: 9, nombre: 'Inversiones', tipo: 'ingreso' },
      { id: 10, nombre: 'Otros ingresos', tipo: 'ingreso' },
    ];
  }

  // Obtener categorías filtradas por tipo (ingreso/egreso)
  async getCategoriesByType(tipo = null) {
    try {
      const allCategories = await this.getCategories();
      
      if (!tipo) {
        return allCategories;
      }
      
      return allCategories.filter(category => 
        category.tipo && category.tipo.toLowerCase() === tipo.toLowerCase()
      );
    } catch (error) {
      console.error('Error obteniendo categorías por tipo:', error);
      // Fallback con categorías hardcodeadas filtradas
      const hardcodedCategories = this.getCategoriesHardcoded();
      if (!tipo) {
        return hardcodedCategories;
      }
      return hardcodedCategories.filter(category => 
        category.tipo && category.tipo.toLowerCase() === tipo.toLowerCase()
      );
    }
  }

  // Verificar saldo disponible
  async verifyBalance(userId, amount) {
    try {
      const response = await fetch(`${API_BASE_URL}/pagos/verificar-saldo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario_id: userId,
          monto: amount,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error verificando saldo:', error);
      throw error;
    }
  }
}

export const pagosService = new PagosService();