import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import Card from '../components/Card';
import BarChart from '../components/BarChart';
import globalStyles from '../styles/globalStyles';
import colors from '../config/colors';

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
    <ScrollView style={globalStyles.screen}>
      <Header navigation={navigation} />
      <Text style={styles.title}>Resumen Financiero</Text>

      {/* TARJETAS */}
      <View style={styles.cardGrid}>
        <Card title="Saldo Actual" value={balance} change={5} />
        <Card
          title="Egresos"
          value={expenses}
          change={-1}
          valueColor={colors.negative}
        />
        <Card title="Ingresos" value={income} wide />
        <Card
          title="Ingresos vs Egresos"
          value={income - expenses}
          wide
          change={5}
        />
      </View>

      {/* GRAFICO BARRAS */}
      <BarChart
        data={['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'].map((m, i) => ({
          label: m,
          value: 80 + i * 4,
        }))}
        barColor="#E2DCC8"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
 
});
