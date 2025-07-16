import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import Header from '../components/Header';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen({ navigation }) {
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);

  useEffect(() => {
    const totalIncome = 8000;
    const totalExpenses = 3500;
    setIncome(totalIncome);
    setExpenses(totalExpenses);
    setBalance(totalIncome - totalExpenses);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Header navigation={navigation} />
      {/* NAV BAR SUPERIOR */}
      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="speedometer" size={20} color="#000" />
          <Text style={[styles.navText, styles.navActive]}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Transaccion')}>
          <Feather name="menu" size={20} color="#A57C36" />
          <Text style={styles.navText}>Transacciones</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Finanzas')}>
          <Feather name="trending-up" size={20} color="#A57C36" />
          <Text style={styles.navText}>Finanzas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Presupuesto')}>
          <MaterialCommunityIcons name="scale-balance" size={20} color="#A57C36" />
          <Text style={styles.navText}>Presupuestos</Text>
        </TouchableOpacity>
      </View>

      {/* TITULO */}
      <Text style={styles.title}>Resumen Financiero</Text>

      {/* TARJETAS */}
      <View style={styles.cardGrid}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Saldo Actual</Text>
          <Text style={styles.cardValue}>${balance}</Text>
          <Text style={styles.cardChangePositive}>+5%</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Egresos</Text>
          <Text style={styles.cardValue}>${expenses}</Text>
          <Text style={styles.cardChangeNegative}>-1%</Text>
        </View>

        <View style={styles.cardWide}>
          <Text style={styles.cardTitle}>Ingresos</Text>
          <Text style={styles.cardValue}>${income}</Text>
        </View>

        <View style={styles.cardWide}>
          <Text style={styles.cardTitle}>Ingresos vs Egresos</Text>
          <Text style={styles.cardValue}>${income - expenses}</Text>
          <Text style={styles.cardChangePositive}>Este mes +5%</Text>
        </View>
      </View>

      {/* GRAFICO BARRAS */}
      <View style={styles.barChart}>
        {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'].map((month, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={[styles.bar, { height: 80 + index * 4 }]} />
            <Text style={styles.barLabel}>{month}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFAF7',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 20,
    backgroundColor: '#FDFBF6',
  },
  navItem: {
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  navText: {
    fontSize: 13,
    color: '#A57C36',
    marginTop: 4,
    textAlign: 'center',
  },
  navActive: {
    fontWeight: 'bold',
    color: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    color: '#1F1F1F',
    textAlign: 'center',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  cardWide: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
  },
  cardChangePositive: {
    color: '#27ae60',
    fontSize: 14,
    marginTop: 4,
  },
  cardChangeNegative: {
    color: '#c0392b',
    fontSize: 14,
    marginTop: 4,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    alignItems: 'flex-end',
    height: 160,
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderRadius: 12,
    elevation: 2,
  },
  barContainer: {
    alignItems: 'center',
  },
  bar: {
    width: 18,
    backgroundColor: '#E2DCC8',
    borderRadius: 4,
  },
  barLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#555',
  },
});
