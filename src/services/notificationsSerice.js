// services/notificationsService.js
const API_BASE_URL = 'http://192.168.1.19:5002';

class NotificationsService {
  
  // Verificar alertas usando tu endpoint existente (ya envía correos automáticamente)
  async checkAndSendBudgetAlerts(usuarioId) {
    try {
      console.log(`🔄 Verificando alertas para usuario ${usuarioId}`);
      const url = `${API_BASE_URL}/presupuestos/alertas/?usuario_id=${usuarioId}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.log(`⚠️ Error obteniendo alertas: ${response.status}`);
        return [];
      }

      const alertas = await response.json();
      console.log(`✅ Alertas procesadas y correos enviados automáticamente:`, alertas);
      
      // Log de resumen
      const critical = alertas.filter(alert => alert.tipo === 'excedido').length;
      const warning = alertas.filter(alert => alert.tipo === 'advertencia').length;
      
      if (critical > 0) {
        console.log(`🚨 ${critical} presupuesto(s) excedido(s) - Correos de alerta enviados`);
      }
      if (warning > 0) {
        console.log(`⚠️ ${warning} presupuesto(s) cerca del límite - Correos de advertencia enviados`);
      }
      
      return alertas || [];
    } catch (error) {
      console.error('Error verificando alertas:', error);
      return [];
    }
  }

  // Obtener resumen rápido de alertas sin enviar correos
  getAlertSummary(alerts) {
    const critical = alerts.filter(alert => alert.tipo === 'excedido').length;
    const warning = alerts.filter(alert => alert.tipo === 'advertencia').length;
    
    return {
      total: alerts.length,
      critical,
      warning,
      hasAlerts: alerts.length > 0,
      hasCritical: critical > 0,
      message: critical > 0 
        ? `${critical} presupuesto(s) excedido(s)`
        : warning > 0 
          ? `${warning} presupuesto(s) cerca del límite`
          : 'Sin alertas'
    };
  }

  // Verificar si un presupuesto específico necesita alerta
  checkBudgetStatus(budget) {
    if (!budget || !budget.monto || budget.monto === 0) {
      return { status: 'ok', message: '' };
    }

    const percentage = (budget.gastado / budget.monto) * 100;
    
    if (percentage >= 100) {
      return {
        status: 'excedido',
        percentage: percentage.toFixed(1),
        message: `Excedido por ${(budget.gastado - budget.monto).toFixed(2)}`
      };
    } else if (percentage >= 80) {
      return {
        status: 'advertencia',
        percentage: percentage.toFixed(1),
        message: `${percentage.toFixed(1)}% del presupuesto usado`
      };
    } else {
      return {
        status: 'ok',
        percentage: percentage.toFixed(1),
        message: `${(100 - percentage).toFixed(1)}% disponible`
      };
    }
  }
}

export const notificationsService = new NotificationsService();