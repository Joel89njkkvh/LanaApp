import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import globalStyles from '../styles/globalStyles';
import colors from '../config/colors';
import { pagosService } from '../services/pagoService';
import { useAuth } from '../context/AuthContext';

export default function PaymentsScreen({ navigation }) {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadPayments();
    }, [])
  );

  const loadPayments = async () => {
    if (!user?.id) {
      console.error('No hay usuario autenticado');
      return;
    }
    try {
      setLoading(true);
      const paymentsData = await pagosService.getPayments(user.id);
      setPayments(paymentsData);
    } catch (error) {
      console.error('Error cargando pagos:', error);
      Alert.alert('Error', 'No se pudieron cargar los pagos');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPayments();
    setRefreshing(false);
  };

  const handlePaymentCreated = () => loadPayments();
  const handlePaymentUpdated = () => loadPayments();

  const navigateToCreatePayment = () =>
    navigation.navigate('CreatePayment', { onPaymentCreated: handlePaymentCreated });

  const navigateToEditPayment = (payment) =>
    navigation.navigate('CreatePayment', { payment, onPaymentUpdated: handlePaymentUpdated });

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'completado':
        return colors.positive;
      case 'pendiente':
        return colors.warning;
      case 'cancelado':
        return colors.negative;
      default:
        return colors.neutral;
    }
  };

  const getStatusText = (estado) => {
    switch (estado) {
      case 'completado':
        return 'Completado';
      case 'pendiente':
        return 'Pendiente';
      case 'cancelado':
        return 'Cancelado';
      default:
        return estado;
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);

  const renderPaymentCard = (payment) => (
    <TouchableOpacity
      key={payment.id}
      style={styles.paymentCard}
      onPress={() => navigateToEditPayment(payment)}
      activeOpacity={0.9}
    >
      <View style={styles.paymentHeader}>
        <Text style={styles.paymentName} numberOfLines={1}>
          {payment.nombre}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payment.estado) }]}>
          <Text style={styles.statusText}>{getStatusText(payment.estado)}</Text>
        </View>
      </View>

      <View style={styles.paymentInfo}>
        <Text style={styles.paymentCategory} numberOfLines={1}>
          {payment.categoria_nombre}
        </Text>
        <Text style={styles.paymentDate}>{formatDate(payment.fecha)}</Text>
      </View>

      <Text style={styles.paymentAmount}>{formatCurrency(payment.monto)}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ScrollView style={globalStyles.screen} contentContainerStyle={styles.screenContent}>
        <Header navigation={navigation} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando pagos...</Text>
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
        <Text style={styles.title}>Mis Pagos</Text>
        <TouchableOpacity style={styles.addButton} onPress={navigateToCreatePayment} activeOpacity={0.9}>
          <Text style={styles.addButtonText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      {payments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No tienes pagos registrados</Text>
          <Text style={styles.emptySubtitle}>Agrega tu primer pago tocando el botón “Nuevo”.</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={navigateToCreatePayment} activeOpacity={0.9}>
            <Text style={styles.emptyButtonText}>Crear Primer Pago</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.paymentsContainer}>
          <Text style={styles.sectionTitle}>
            {payments.length} {payments.length === 1 ? 'pago' : 'pagos'} registrados
          </Text>
          {payments.map(renderPaymentCard)}
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

  // Encabezado de la pantalla (coincide con Header styling)
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

  // Loading
  loadingContainer: {
    alignItems: 'center',
    paddingTop: 80,
  },
  loadingText: {
    fontSize: 16,
    color: colors.neutral,
  },

  // Empty state
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

  // Listado
  paymentsContainer: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral,
    marginBottom: 12,
  },

  // Card de pago (alineado con estética del Header/tema)
  paymentCard: {
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
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  paymentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentCategory: {
    fontSize: 13,
    color: colors.neutral,
    flex: 1,
    marginRight: 8,
  },
  paymentDate: {
    fontSize: 13,
    color: colors.neutral,
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'right',
  },
});
