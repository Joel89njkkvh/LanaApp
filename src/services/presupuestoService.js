// services/presupuestosService.js
import { API_BASE_URL } from '../config/apiConfig';

class PresupuestosService {
  
  // Listar todos los presupuestos
  async getBudgets(usuarioId) {
    try {
      console.log(`🔄 Obteniendo presupuestos para usuario ${usuarioId}`);
      const url = `${API_BASE_URL}/presupuestos/?usuario_id=${usuarioId}`;
      console.log(`📡 URL: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Agregar headers de autenticación si es necesario
          // 'Authorization': `Bearer ${token}`,
        },
      });

      console.log(`📥 Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Error response: ${errorText}`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Presupuestos obtenidos:`, data);
      
      // Obtener categorías para hacer el mapeo de nombres
      let categories = [];
      try {
        categories = await this.getCategories();
        console.log(`✅ Categorías para mapeo:`, categories);
      } catch (error) {
        console.warn('No se pudieron cargar las categorías para el mapeo');
        categories = this.getDefaultCategories();
      }
      
      // Obtener categorías faltantes individualmente si es necesario
      const uniqueCategoryIds = [...new Set(data.map(budget => budget.categoria_id))];
      console.log(`🔍 IDs de categorías necesarios:`, uniqueCategoryIds);
      
      for (const categoryId of uniqueCategoryIds) {
        const existingCategory = categories.find(cat => cat.id == categoryId);
        if (!existingCategory) {
          console.log(`🔄 Obteniendo categoría faltante: ${categoryId}`);
          const category = await this.getCategory(categoryId);
          if (category) {
            categories.push(category);
          }
        }
      }
      
      console.log(`✅ Categorías finales disponibles:`, categories);
      
      // Transformar los datos para que coincidan con la UI
      return data.map(budget => {
        // Buscar el nombre de la categoría con logs para debugging
        console.log(`🔍 Buscando categoría para budget ${budget.id}, categoria_id: ${budget.categoria_id}`);
        
        const categoria = categories.find(cat => {
          console.log(`🔍 Comparando cat.id (${cat.id}) == budget.categoria_id (${budget.categoria_id})`);
          return cat.id == budget.categoria_id; // Usar == en lugar de === para comparación flexible
        });
        
        const categoriaNombre = categoria ? categoria.nombre : `Categoría ${budget.categoria_id}`;
        console.log(`✅ Categoría encontrada:`, categoria ? `${categoria.nombre} (ID: ${categoria.id})` : 'No encontrada');
        
        return {
          id: budget.id,
          categoria_id: budget.categoria_id,
          categoria_nombre: categoriaNombre,
          monto: parseFloat(budget.monto) || 0,
          gastado: parseFloat(budget.monto_usado || budget.gastado || 0), // Usar monto_usado si existe
          mes: budget.mes,
          año: budget.año,
          usuario_id: budget.usuario_id,
        };
      });
    } catch (error) {
      console.error('Error obteniendo presupuestos:', error);
      throw error;
    }
  }

  // Obtener un presupuesto específico
  async getBudget(presupuestoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/presupuestos/${presupuestoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        id: data.id,
        categoria_id: data.categoria_id,
        categoria_nombre: data.categoria_nombre || data.categoria?.nombre || 'Sin categoría',
        monto: parseFloat(data.monto) || 0,
        gastado: parseFloat(data.gastado) || 0,
        mes: data.mes,
        año: data.año,
      };
    } catch (error) {
      console.error('Error obteniendo presupuesto:', error);
      throw error;
    }
  }

  // Crear un nuevo presupuesto - CORREGIDO
  async createBudget(usuarioId, budgetData) {
    try {
      console.log(`🔄 Creando presupuesto para usuario ${usuarioId}:`, budgetData);
      
      // ✅ CORRECCIÓN: usuario_id va como query parameter, NO en el body
      const url = `${API_BASE_URL}/presupuestos/?usuario_id=${usuarioId}`;
      console.log(`📡 URL: ${url}`);
      
      // Preparar el body SOLO con los campos requeridos (sin usuario_id)
      const requestBody = {
        monto: parseFloat(budgetData.monto),
        mes: parseInt(budgetData.mes),
        año: parseInt(budgetData.año),
        categoria_id: parseInt(budgetData.categoria_id),
      };
      
      console.log(`📤 Request body:`, requestBody);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log(`📥 Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Error response: ${errorText}`);
        
        // Intentar parsear como JSON para obtener más detalles del error
        let errorData = {};
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          // Si no es JSON válido, usar el texto tal como está
        }
        
        throw new Error(errorData.message || errorData.detail || `Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log(`✅ Presupuesto creado:`, data);
      return data;
    } catch (error) {
      console.error('Error creando presupuesto:', error);
      throw error;
    }
  }

  // Actualizar un presupuesto existente
  async updateBudget(presupuestoId, budgetData) {
    try {
      console.log(`🔄 Actualizando presupuesto ${presupuestoId}:`, budgetData);
      
      const requestBody = {
        monto: parseFloat(budgetData.monto),
        mes: parseInt(budgetData.mes),
        año: parseInt(budgetData.año),
        categoria_id: parseInt(budgetData.categoria_id),
      };
      
      console.log(`📤 Request body:`, requestBody);
      
      const response = await fetch(`${API_BASE_URL}/presupuestos/${presupuestoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log(`📥 Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Error response: ${errorText}`);
        
        let errorData = {};
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          // Si no es JSON válido, usar el texto tal como está
        }
        
        throw new Error(errorData.message || errorData.detail || `Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log(`✅ Presupuesto actualizado:`, data);
      return data;
    } catch (error) {
      console.error('Error actualizando presupuesto:', error);
      throw error;
    }
  }

  // Eliminar un presupuesto
  async deleteBudget(presupuestoId) {
    try {
      console.log(`🔄 Eliminando presupuesto ${presupuestoId}`);
      
      const response = await fetch(`${API_BASE_URL}/presupuestos/${presupuestoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`,
        },
      });

      console.log(`📥 Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Error response: ${errorText}`);
        
        let errorData = {};
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          // Si no es JSON válido, usar el texto tal como está
        }
        
        throw new Error(errorData.message || errorData.detail || `Error ${response.status}: ${errorText}`);
      }

      console.log(`✅ Presupuesto eliminado correctamente`);
      return true;
    } catch (error) {
      console.error('Error eliminando presupuesto:', error);
      throw error;
    }
  }

  // Obtener alertas de presupuestos (manejo de errores mejorado)
  async getBudgetAlerts(usuarioId) {
    try {
      console.log(`🔄 Obteniendo alertas para usuario ${usuarioId}`);
      const url = `${API_BASE_URL}/presupuestos/alertas/?usuario_id=${usuarioId}`;
      console.log(`📡 URL: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`,
        },
      });

      console.log(`📥 Response status: ${response.status}`);

      if (!response.ok) {
        console.error(`❌ Error en alertas: ${response.status}`);
        // Si hay error en alertas, devolver array vacío en lugar de fallar
        return [];
      }

      const data = await response.json();
      console.log(`✅ Alertas obtenidas:`, data);
      return data || [];
    } catch (error) {
      console.error('Error obteniendo alertas:', error);
      // Devolver array vacío si falla, no romper la app
      return [];
    }
  }

  // Obtener categorías disponibles - CORREGIDO para API individual
  async getCategories() {
    try {
      console.log('🔄 Obteniendo categorías individuales');
      
      // Como la API requiere ID individual, obtener las más comunes
      const categoryIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const categories = [];
      
      for (const id of categoryIds) {
        try {
          const url = `${API_BASE_URL}/categorias/${id}`;
          console.log(`📡 Obteniendo categoría ${id}: ${url}`);
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const categoryData = await response.json();
            console.log(`✅ Categoría ${id} obtenida:`, categoryData);
            
            categories.push({
              id: id,
              nombre: categoryData.nombre,
              tipo: categoryData.tipo
            });
          } else {
            console.log(`⚠️ Categoría ${id} no encontrada`);
          }
        } catch (error) {
          console.log(`⚠️ Error obteniendo categoría ${id}:`, error);
        }
      }
      
      console.log(`✅ Total categorías obtenidas: ${categories.length}`, categories);
      
      // Si obtuvimos algunas categorías, usarlas; si no, usar por defecto
      if (categories.length > 0) {
        return categories;
      } else {
        console.log('🔄 No se obtuvieron categorías, usando por defecto');
        return this.getDefaultCategories();
      }
      
    } catch (error) {
      console.error('❌ Error general obteniendo categorías:', error);
      console.log('🔄 Usando categorías por defecto debido a excepción');
      return this.getDefaultCategories();
    }
  }

  // Obtener una categoría individual por ID
  async getCategory(categoryId) {
    try {
      console.log(`🔄 Obteniendo categoría individual ${categoryId}`);
      
      const url = `${API_BASE_URL}/categorias/${categoryId}`;
      console.log(`📡 URL: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.log(`⚠️ Categoría ${categoryId} no encontrada`);
        return null;
      }

      const data = await response.json();
      console.log(`✅ Categoría ${categoryId} obtenida:`, data);
      
      return {
        id: categoryId,
        nombre: data.nombre,
        tipo: data.tipo
      };
    } catch (error) {
      console.error(`❌ Error obteniendo categoría ${categoryId}:`, error);
      return null;
    }
  }

  // Categorías por defecto en caso de error
  getDefaultCategories() {
    return [
      { id: 1, nombre: 'Alimentación' },
      { id: 2, nombre: 'Transporte' },
      { id: 3, nombre: 'Entretenimiento' },
      { id: 4, nombre: 'Servicios' },
      { id: 5, nombre: 'Salud' },
      { id: 6, nombre: 'Educación' },
      { id: 7, nombre: 'Ropa' },
      { id: 8, nombre: 'Otros' },
      { id: 9, nombre: 'Hogar' },
      { id: 10, nombre: 'Trabajo' },
    ];
  }

  // Obtener resumen de gastos por presupuesto (si tienes este endpoint)
  async getBudgetSummary(budgetId) {
    try {
      console.log(`🔄 Obteniendo resumen del presupuesto ${budgetId}`);
      
      const response = await fetch(`${API_BASE_URL}/presupuestos/${budgetId}/resumen`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`,
        },
      });

      console.log(`📥 Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Error obteniendo resumen: ${errorText}`);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log(`✅ Resumen obtenido:`, data);
      return data;
    } catch (error) {
      console.error('Error obteniendo resumen de presupuesto:', error);
      throw error;
    }
  }
}

export const presupuestosService = new PresupuestosService();