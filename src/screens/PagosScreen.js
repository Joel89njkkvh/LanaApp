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

  const handlePaymentCreated = () => {
    loadPayments();
  };

  const handlePaymentUpdated = () => {
    loadPayments();
  };

  const navigateToCreatePayment = () => {
    navigation.navigate('CreatePayment', {
      onPaymentCreated: handlePaymentCreated,
    });
  };

  const navigateToEditPayment = (payment) => {
    navigation.navigate('CreatePayment', {
      payment: payment,
      onPaymentUpdated: handlePaymentUpdated,
    });
  };

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const renderPaymentCard = (payment) => (
    <TouchableOpacity
      key={payment.id}
      style={styles.paymentCard}
      onPress={() => navigateToEditPayment(payment)}
    >
      <View style={styles.paymentHeader}>
        <Text style={styles.paymentName}>{payment.nombre}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payment.estado) }]}>
          <Text style={styles.statusText}>{getStatusText(payment.estado)}</Text>
        </View>
      </View>
      
      <View style={styles.paymentInfo}>
        <Text style={styles.paymentCategory}>{payment.categoria_nombre}</Text>
        <Text style={styles.paymentDate}>{formatDate(payment.fecha)}</Text>
      </View>
      
      <Text style={styles.paymentAmount}>{formatCurrency(payment.monto)}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ScrollView style={globalStyles.screen}>
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
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Header navigation={navigation} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Mis Pagos</Text>
        <TouchableOpacity style={styles.addButton} onPress={navigateToCreatePayment}>
          <Text style={styles.addButtonText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      {payments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No tienes pagos registrados</Text>
          <Text style={styles.emptySubtitle}>
            Agrega tu primer pago tocando el botón "Nuevo"
          </Text>
          <TouchableOpacity style={styles.emptyButton} onPress={navigateToCreatePayment}>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F1F1F',
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    fontSize: 16,
    color: colors.neutral,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F1F1F',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.neutral,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral,
    marginBottom: 16,
  },
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F1F1F',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  paymentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentCategory: {
    fontSize: 14,
    color: colors.neutral,
  },
  paymentDate: {
    fontSize: 14,
    color: colors.neutral,
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'right',
  },
});