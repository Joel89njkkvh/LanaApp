import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import AlertBanner from '../components/AlertBanner';
import globalStyles from '../styles/globalStyles';
import colors from '../config/colors';
import { presupuestosService } from '../services/presupuestoService';
import { useAuth } from '../context/AuthContext';

export default function PresupuestosScreen({ navigation }) {
  const { user } = useAuth(); // Obtener usuario del contexto (incluye email)
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [showAlerts, setShowAlerts] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadInitialData();
    }
  }, [user]);

  const loadInitialData = async () => {
    await Promise.all([
      loadBudgets(),
      loadAlertsAndNotify()
    ]);
  };

  const loadBudgets = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      console.log(`🔄 Cargando presupuestos para usuario ${user.id}`);
      const budgetsData = await presupuestosService.getBudgets(user.id);
      setBudgets(budgetsData);
    } catch (error) {
      console.error('Error cargando presupuestos:', error);
      Alert.alert('Error', 'No se pudieron cargar los presupuestos');
    } finally {
      setLoading(false);
    }
  };

  const loadAlertsAndNotify = async () => {
    if (!user?.id) return;
    
    try {
      console.log(`🔔 Verificando alertas para usuario ${user.id}`);
      
      // Usar el endpoint que ya tienes que también envía correos automáticamente
      const alertsData = await presupuestosService.getBudgetAlerts(user.id);
      setAlerts(alertsData);
      
      // Mostrar notificación en la app si hay alertas críticas
      const criticalAlerts = alertsData.filter(alert => alert.tipo === 'excedido');
      if (criticalAlerts.length > 0) {
        console.log(`🚨 ${criticalAlerts.length} presupuesto(s) excedido(s) - Correos enviados automáticamente`);
      }
      
    } catch (error) {
      console.error('Error cargando alertas:', error);
      setAlerts([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const handleViewAlertDetails = () => {
    if (alerts.length > 0) {
      const alertMessage = alerts.map(alert => 
        `📊 ${alert.categoria}\n` +
        `💰 Gastado: $${alert.monto_gastado?.toFixed(2) || '0.00'} de $${alert.monto_limite?.toFixed(2) || '0.00'}\n` +
        `📈 Porcentaje usado: ${alert.porcentaje_usado?.toFixed(1) || '0'}%\n` +
        `${alert.tipo === 'excedido' ? '🚨' : '⚠️'} ${alert.mensaje}\n`
      ).join('\n');
      
      Alert.alert(
        'Detalles de Alertas',
        alertMessage,
        [
          { 
            text: 'Verificar de nuevo', 
            onPress: loadAlertsAndNotify 
          },
          { 
            text: 'OK' 
          }
        ]
      );
    }
  };

  const handleCreateBudget = () => {
    navigation.navigate('CreateBudget', {
      onBudgetCreated: () => {
        loadInitialData();
      }
    });
  };

  const handleEditBudget = (budget) => {
    navigation.navigate('EditBudget', {
      budget: budget,
      onBudgetUpdated: () => {
        loadInitialData();
      }
    });
  };

  const renderBudgetCard = (item, index) => {
    const remaining = item.monto - item.gastado;
    const isOver = remaining < 0;
    const progressPercentage = item.gastado / item.monto;

    // Determinar el color según el porcentaje usado
    const getProgressColor = () => {
      if (progressPercentage >= 1) return colors.negative;
      if (progressPercentage >= 0.8) return '#FF9800';
      return colors.primary;
    };

    return (
      <TouchableOpacity 
        key={index} 
        style={[styles.card, isOver && styles.cardOver]}
        onPress={() => handleEditBudget(item)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.categoria_nombre}</Text>
          <View style={styles.cardMonth}>
            <Text style={styles.cardMonthText}>{item.mes}/{item.año}</Text>
          </View>
        </View>
        
        <Text style={styles.cardValue}>
          Gastado: ${item.gastado?.toFixed(2) || '0.00'} / ${item.monto.toFixed(2)}
        </Text>
        
        <Text style={isOver ? styles.cardOverText : styles.cardRemaining}>
          {isOver 
            ? `Excedido por $${Math.abs(remaining).toFixed(2)}` 
            : `Disponible: $${remaining.toFixed(2)}`
          }
        </Text>
        
        <ProgressBar 
          progress={Math.min(progressPercentage, 1)} 
          color={getProgressColor()}
        />
        
        {isOver && (
          <View style={styles.warningBadge}>
            <Text style={styles.warningText}>⚠️ Presupuesto excedido</Text>
          </View>
        )}

        {progressPercentage >= 0.8 && !isOver && (
          <View style={styles.warningBadge}>
            <Text style={styles.warningText}>
              🔔 Cerca del límite ({(progressPercentage * 100).toFixed(1)}%)
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Mostrar estado de carga inicial
  if (loading && !refreshing && budgets.length === 0) {
    return (
      <ScrollView style={globalStyles.screen}>
        <Header navigation={navigation} />
        <Text style={styles.title}>Mis Presupuestos</Text>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando presupuestos...</Text>
          <Text style={styles.loadingSubtext}>Verificando alertas automáticamente</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView 
      style={globalStyles.screen}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          colors={[colors.primary]}
        />
      }
    >
      <Header navigation={navigation} />
      
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Mis Presupuestos</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleCreateBudget}
        >
          <Text style={styles.addButtonText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      {/* Info sobre notificaciones por email */}
      {user?.email && (
        <View style={styles.emailInfoContainer}>
          <Text style={styles.emailInfoText}>
            📧 Notificaciones activas en: {user.email}
          </Text>
        </View>
      )}

      {/* Banner de Alertas */}
      {showAlerts && alerts.length > 0 && (
        <AlertBanner
          alerts={alerts}
          onDismiss={() => setShowAlerts(false)}
          onViewDetails={handleViewAlertDetails}
        />
      )}

      {budgets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes presupuestos creados</Text>
          <TouchableOpacity 
            style={styles.createFirstButton}
            onPress={handleCreateBudget}
          >
            <Text style={styles.createFirstButtonText}>Crear mi primer presupuesto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {budgets.map((item, index) => renderBudgetCard(item, index))}
          
          {/* Botón para verificar alertas manualmente */}
          <TouchableOpacity 
            style={styles.checkAlertsButton}
            onPress={loadAlertsAndNotify}
          >
            <Text style={styles.checkAlertsButtonText}>🔔 Verificar Alertas</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F1F1F',
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emailInfoContainer: {
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.positive,
  },
  emailInfoText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardOver: {
    borderLeftWidth: 4,
    borderLeftColor: colors.negative,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  cardMonth: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardMonthText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 16,
    marginBottom: 4,
    color: '#555',
  },
  cardRemaining: {
    fontSize: 14,
    color: colors.positive,
    marginBottom: 8,
  },
  cardOverText: {
    fontSize: 14,
    color: colors.negative,
    marginBottom: 8,
    fontWeight: '600',
  },
  warningBadge: {
    backgroundColor: '#FFF3E0',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
  },
  warningText: {
    color: '#F57C00',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  createFirstButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createFirstButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  checkAlertsButton: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  checkAlertsButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },
});