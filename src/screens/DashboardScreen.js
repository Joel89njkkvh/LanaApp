import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import Header from '../components/Header';
import NavBar from '../components/NavBar';

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
       <NavBar navigation={navigation} active="Dashboard" />
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
