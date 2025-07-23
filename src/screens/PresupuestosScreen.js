import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import ProgressBar from '../components/ProgressBar';
import globalStyles from '../styles/globalStyles';
import colors from '../config/colors';

export default function PresupuestosScreen({ navigation }) {
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    const mockBudgets = [
      { category: 'Alimentación', limit: 1000, spent: 650 },
      { category: 'Transporte', limit: 500, spent: 300 },
      { category: 'Entretenimiento', limit: 400, spent: 150 },
      { category: 'Servicios', limit: 600, spent: 580 },
    ];
    setBudgets(mockBudgets);
  }, []);

  

  return (
    <ScrollView style={globalStyles.screen}>
       <Header navigation={navigation} />
       <NavBar navigation={navigation} active="Presupuesto" />

      <Text style={styles.title}>Mis Presupuestos</Text>

      {budgets.map((item, index) => {
        const remaining = item.limit - item.spent;
        const isOver = remaining < 0;

        return (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{item.category}</Text>
            <Text style={styles.cardValue}>Gastado: ${item.spent} / ${item.limit}</Text>
            <Text style={isOver ? styles.cardOver : styles.cardRemaining}>
              {isOver ? `Excedido por $${Math.abs(remaining)}` : `Disponible: $${remaining}`}
            </Text>
            <ProgressBar progress={item.spent / item.limit} />
          </View>
        );
      })}
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
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
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
});
