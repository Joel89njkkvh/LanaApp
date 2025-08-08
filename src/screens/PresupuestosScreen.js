import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import globalStyles from '../styles/globalStyles';
import colors from '../config/colors';
import { presupuestosService } from '../services/presupuestoService';
import { useAuth } from '../context/AuthContext'; // Importar AuthContext

export default function PresupuestosScreen({ navigation }) {
  const { user } = useAuth(); // Obtener usuario del contexto
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (user?.id) {
      loadBudgets();
      loadAlerts();
    }
  }, [user]);

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

  const loadAlerts = async () => {
    if (!user?.id) return;
    
    try {
      console.log(`🔄 Cargando alertas para usuario ${user.id}`);
      const alertsData = await presupuestosService.getBudgetAlerts(user.id);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error cargando alertas:', error);
      // No mostrar alert para alertas, es menos crítico
      setAlerts([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBudgets();
    await loadAlerts();
    setRefreshing(false);
  };

  const handleCreateBudget = () => {
    navigation.navigate('CreateBudget', {
      onBudgetCreated: () => {
        loadBudgets();
        loadAlerts();
      }
    });
  };

  const handleEditBudget = (budget) => {
    navigation.navigate('EditBudget', {
      budget: budget,
      onBudgetUpdated: () => {
        loadBudgets();
        loadAlerts();
      }
    });
  };

  const renderBudgetCard = (item, index) => {
    const remaining = item.monto - item.gastado;
    const isOver = remaining < 0;
    const progressPercentage = item.gastado / item.monto;

    return (
      <TouchableOpacity 
        key={index} 
        style={styles.card}
        onPress={() => handleEditBudget(item)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.categoria_nombre}</Text>
          <Text style={styles.cardMonth}>{item.mes}/{item.año}</Text>
        </View>
        
        <Text style={styles.cardValue}>
          Gastado: ${item.gastado?.toFixed(2) || '0.00'} / ${item.monto.toFixed(2)}
        </Text>
        
        <Text style={isOver ? styles.cardOver : styles.cardRemaining}>
          {isOver 
            ? `Excedido por $${Math.abs(remaining).toFixed(2)}` 
            : `Disponible: $${remaining.toFixed(2)}`
          }
        </Text>
        
        <ProgressBar progress={Math.min(progressPercentage, 1)} />
        
        {isOver && (
          <View style={styles.warningBadge}>
            <Text style={styles.warningText}>⚠️ Presupuesto excedido</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <ScrollView style={globalStyles.screen}>
        <Header navigation={navigation} />
        <Text style={styles.title}>Mis Presupuestos</Text>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando presupuestos...</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView 
      style={globalStyles.screen}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
        budgets.map((item, index) => renderBudgetCard(item, index))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
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
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  },
  cardMonth: {
    fontSize: 14,
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
  cardOver: {
    fontSize: 14,
    color: colors.negative,
    marginBottom: 8,
  },
  warningBadge: {
    backgroundColor: '#FFF3E0',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.negative,
  },
  warningText: {
    color: colors.negative,
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
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
});