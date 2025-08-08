import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import globalStyles from '../styles/globalStyles';
import colors from '../config/colors';
import { presupuestosService } from '../services/presupuestoService';
import { useAuth } from '../context/AuthContext';

export default function PresupuestosScreen({ navigation }) {
  const { user } = useAuth();
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
      const alertsData = await presupuestosService.getBudgetAlerts(user.id);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error cargando alertas:', error);
      setAlerts([]);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadBudgets(), loadAlerts()]);
    setRefreshing(false);
  }, []);

  const handleCreateBudget = () => {
    navigation.navigate('CreateBudget', {
      onBudgetCreated: () => {
        loadBudgets();
        loadAlerts();
      },
    });
  };

  const handleEditBudget = (budget) => {
    navigation.navigate('EditBudget', {
      budget,
      onBudgetUpdated: () => {
        loadBudgets();
        loadAlerts();
      },
    });
  };

  const renderBudgetCard = (item, index) => {
    const remaining = item.monto - item.gastado;
    const isOver = remaining < 0;
    const progressPercentage = item.gastado / item.monto;

    return (
      <TouchableOpacity key={index} style={styles.card} onPress={() => handleEditBudget(item)} activeOpacity={0.9}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.categoria_nombre}
          </Text>
          <Text style={styles.cardMonth}>
            {item.mes}/{item.año}
          </Text>
        </View>

        <Text style={styles.cardValue}>
          Gastado: ${item.gastado?.toFixed(2) || '0.00'} / ${item.monto.toFixed(2)}
        </Text>

        <Text style={isOver ? styles.cardOver : styles.cardRemaining}>
          {isOver ? `Excedido por $${Math.abs(remaining).toFixed(2)}` : `Disponible: $${remaining.toFixed(2)}`}
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
      <ScrollView style={globalStyles.screen} contentContainerStyle={styles.screenContent}>
        <Header navigation={navigation} />
        <View style={styles.toolbar}>
          <Text style={styles.title}>Mis Presupuestos</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando presupuestos...</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={globalStyles.screen}
      contentContainerStyle={styles.screenContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Header navigation={navigation} />

      <View style={styles.toolbar}>
        <Text style={styles.title}>Mis Presupuestos</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateBudget} activeOpacity={0.9}>
          <Text style={styles.addButtonText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      {budgets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No tienes presupuestos creados</Text>
          <Text style={styles.emptySubtitle}>Crea tu primer presupuesto para empezar a controlar tus gastos.</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={handleCreateBudget} activeOpacity={0.9}>
            <Text style={styles.emptyButtonText}>Crear mi primer presupuesto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {alerts?.length > 0 && (
            <View style={styles.alertContainer}>
              <Text style={styles.alertText}>
                Tienes {alerts.length} {alerts.length === 1 ? 'alerta' : 'alertas'} de presupuesto
              </Text>
            </View>
          )}
          {budgets.map(renderBudgetCard)}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  // Encabezado (coherente con PaymentsScreen/Header)
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  // Estado de carga
  loadingContainer: {
    alignItems: 'center',
    paddingTop: 80,
  },
  loadingText: {
    fontSize: 16,
    color: colors.neutral,
  },

  // Alertas
  alertContainer: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FFE3C2',
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  alertText: {
    color: '#A15B00',
    fontSize: 13,
    fontWeight: '600',
  },

  // Lista y tarjetas
  listContainer: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  cardMonth: {
    fontSize: 13,
    color: colors.neutral,
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 14,
    marginBottom: 4,
    color: colors.neutral,
  },
  cardRemaining: {
    fontSize: 13,
    color: colors.positive,
    marginBottom: 8,
    fontWeight: '700',
  },
  cardOver: {
    fontSize: 13,
    color: colors.negative,
    marginBottom: 8,
    fontWeight: '700',
  },

  // Aviso de exceso
  warningBadge: {
    backgroundColor: '#FFF3F3',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.negative,
  },
  warningText: {
    color: colors.negative,
    fontSize: 12,
    fontWeight: '700',
  },

  // Vacío
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.neutral,
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
