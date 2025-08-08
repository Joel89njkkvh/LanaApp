import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import Card from '../components/Card';
import SimpleDonutChart from '../components/SimpleDonutChart';
import globalStyles from '../styles/globalStyles';
import colors from '../config/colors';

const API_BASE_URL = 'http://192.168.1.19:5002';

export default function DashboardScreen({ navigation, route }) {
  const [financialData, setFinancialData] = useState({
    saldo: 0,
    ingresos: 0,
    egresos: 0,
    periodo: ''
  });
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Obtener el ID del usuario desde AsyncStorage (como hacen las otras pantallas)
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
        
        console.log('Dashboard - Usuario ID obtenido:', userIdToUse);
        setUserId(userIdToUse);
      } catch (error) {
        console.error('Error getting userId:', error);
        setUserId(1); // Fallback
      }
    };

    getUserId();
  }, [route?.params?.userId]);

  // Función para obtener el resumen financiero
  const fetchFinancialSummary = async (userID) => {
    try {
      console.log('Dashboard - Fetching financial summary for user:', userID);
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

  // Función para obtener gastos por categoría
  const fetchCategoryExpenses = async (userID) => {
    try {
      console.log('Dashboard - Fetching category expenses for user:', userID);
      const response = await fetch(`${API_BASE_URL}/gastos-categoria/${userID}`);
      if (!response.ok) {
        throw new Error('Error al obtener gastos por categoría');
      }
      const result = await response.json();
      setCategoryData(result.data);
    } catch (error) {
      console.error('Error fetching category expenses:', error);
      Alert.alert('Error', 'No se pudieron cargar los gastos por categoría');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (userId) {
        setLoading(true);
        console.log('Dashboard - Cargando datos para usuario ID:', userId);
        await Promise.all([
          fetchFinancialSummary(userId),
          fetchCategoryExpenses(userId)
        ]);
        setLoading(false);
      }
    };

    loadData();
  }, [userId]); // Se ejecuta cuando userId cambie

  // Transformar datos de categorías para el gráfico
  const transformCategoryDataForChart = () => {
    return categoryData.map(item => ({
      label: item.categoria,
      value: item.total
    }));
  };

  if (loading) {
    return (
      <ScrollView style={globalStyles.screen}>
        <Header navigation={navigation} />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={globalStyles.screen}>
      <Header navigation={navigation} />
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.period}>{financialData.periodo}</Text>

      {/* TARJETAS */}
      <View style={styles.cardGrid}>
        <Card 
          title="Saldo Actual" 
          value={financialData.saldo} 
          change={5} 
        />
        <Card
          title="Egresos"
          value={financialData.egresos}
          change={-1}
          valueColor={colors.negative}
        />
        <Card 
          title="Ingresos" 
          value={financialData.ingresos} 
          wide 
        />
        <Card
          title="Ingresos vs Egresos"
          value={financialData.ingresos - financialData.egresos}
          wide
          change={5}
        />
      </View>

      {/* GRAFICO CIRCULAR DE GASTOS POR CATEGORIA */}
      {categoryData.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Gastos por Categoría</Text>
          <SimpleDonutChart
            data={transformCategoryDataForChart()}
            size={140}
            strokeWidth={16}
            colors={['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']}
          />
        </View>
      )}
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
    marginTop: 16, // Margen reducido
    marginBottom: 12, // Margen reducido
    color: '#1F1F1F',
    textAlign: 'center',
  },
  chartContainer: {
    marginTop: 16,
    marginBottom: 16, // Reducido
  },
  chartWrapper: {
    height: 180, // Altura mucho más pequeña
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12, // Padding reducido
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
});