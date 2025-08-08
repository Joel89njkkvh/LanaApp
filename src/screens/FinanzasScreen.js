import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import Card from '../components/Card';
import MiniLineChart from '../components/MiniLineChart';
import globalStyles from '../styles/globalStyles';
import colors from '../config/colors';

const screenWidth = Dimensions.get('window').width;
const API_BASE_URL = 'http://192.168.1.19:5002';

export default function FinanzasScreen({ navigation, route }) {
  const [financialData, setFinancialData] = useState({
    saldo: 0,
    ingresos: 0,
    egresos: 0,
    periodo: ''
  });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Obtener el ID del usuario desde AsyncStorage (igual que Dashboard)
  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedUser = await AsyncStorage.getItem('user');
        
        let userIdToUse = null;
        
        if (storedUserId) {
          userIdToUse = parseInt(storedUserId);
        } else if (storedUser) {
          const userData = JSON.parse(storedUser);
          userIdToUse = userData.id || userData.usuario_id;
        } else if (route?.params?.userId) {
          userIdToUse = route.params.userId;
        }
        
        console.log('Finanzas - Usuario ID obtenido:', userIdToUse);
        setUserId(userIdToUse);
      } catch (error) {
        console.error('Error getting userId:', error);
        setUserId(1); // Fallback
      }
    };

    getUserId();
  }, [route?.params?.userId]);

  // Función para obtener el resumen financiero (reutilizamos el mismo endpoint)
  const fetchFinancialSummary = async (userID) => {
    try {
      console.log('Finanzas - Fetching financial summary for user:', userID);
      const response = await fetch(`${API_BASE_URL}/resumen-financiero/${userID}`);
      if (!response.ok) {
        throw new Error('Error al obtener resumen financiero');
      }
      const data = await response.json();
      setFinancialData(data);
    } catch (error) {
      console.error('Error fetching financial summary:', error);
      Alert.alert('Error', 'No se pudo cargar el resumen financiero');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (userId) {
        setLoading(true);
        console.log('Finanzas - Cargando datos financieros para usuario ID:', userId);
        await fetchFinancialSummary(userId);
        setLoading(false);
      }
    };

    loadData();
  }, [userId]); // Se ejecuta cuando userId cambie

  // Datos simulados para el gráfico de rendimiento mensual
  // Puedes reemplazar esto con datos reales de otro endpoint si tienes
  const getMonthlyTrendData = () => {
    // Simulamos un histórico basado en los datos actuales
    const baseValue = financialData.saldo / 6; // Dividimos entre 6 meses
    return ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'].map((month, index) => ({
      label: month,
      value: Math.round(baseValue + (index * baseValue * 0.1)) // Crecimiento del 10% cada mes
    }));
  };

  // Calcular métricas derivadas
  const calcularRendimiento = () => {
    return financialData.ingresos - financialData.egresos;
  };

  const calcularAhorros = () => {
    // Asumimos que los ahorros son el 60% del saldo
    return Math.round(financialData.saldo * 0.6);
  };

  const calcularInversiones = () => {
    // Asumimos que las inversiones son el 40% del saldo
    return Math.round(financialData.saldo * 0.4);
  };

  if (loading) {
    return (
      <ScrollView style={globalStyles.screen}>
        <Header navigation={navigation} />
        <Text style={styles.loadingText}>Cargando datos financieros...</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={globalStyles.screen}>
      <Header navigation={navigation} />

      {/* TITULO */}
      <Text style={styles.title}>Estado Financiero</Text>
      <Text style={styles.period}>{financialData.periodo}</Text>

      {/* TARJETAS CON DATOS REALES */}
      <View style={styles.cardGrid}>
        <Card 
          title="Inversiones" 
          value={calcularInversiones()} 
          change={3} 
        />
        <Card 
          title="Ahorros" 
          value={calcularAhorros()} 
          change={2} 
        />
        <Card 
          title="Rendimiento Mensual" 
          value={calcularRendimiento()} 
          wide 
          change={4} 
        />
      </View>

      {/* GRAFICO DE LINEA - TENDENCIA FINANCIERA */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Tendencia de Saldo</Text>
        <MiniLineChart
          data={getMonthlyTrendData()}
          height={120}
          color="#4CAF50"
          showDots={true}
          showLabels={true}
        />
      </View>

      {/* RESUMEN ADICIONAL */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Resumen del Período</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Ingresos:</Text>
          <Text style={[styles.summaryValue, { color: colors.positive || '#4CAF50' }]}>
            ${financialData.ingresos.toLocaleString()}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Egresos:</Text>
          <Text style={[styles.summaryValue, { color: colors.negative || '#F44336' }]}>
            ${financialData.egresos.toLocaleString()}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Saldo Final:</Text>
          <Text style={[styles.summaryValue, { 
            color: financialData.saldo >= 0 ? (colors.positive || '#4CAF50') : (colors.negative || '#F44336')
          }]}>
            ${financialData.saldo.toLocaleString()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1F1F1F',
    textAlign: 'center',
  },
  period: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  chartTitle: {
    fontSize: 16, // Título más pequeño
    fontWeight: '600',
    marginTop: 12, // Margen muy reducido
    marginBottom: 8, // Margen muy reducido
    color: '#1F1F1F',
    textAlign: 'center',
  },
  chartContainer: {
    marginTop: 12, // Margen reducido
    marginBottom: 12, // Margen reducido
  },
  chartWrapper: {
    height: 160, // Altura aún más pequeña
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10, // Padding mínimo
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 3,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
  summaryContainer: {
    backgroundColor: '#f8f9fa',
    marginHorizontal: 16,
    marginTop: 12, // Margen reducido
    marginBottom: 16, // Margen reducido
    padding: 14, // Padding reducido
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1F1F1F',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});