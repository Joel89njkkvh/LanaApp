import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import NavBar from '../components/NavBar';

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

  const renderBar = (spent, limit) => {
    const percentage = Math.min((spent / limit) * 100, 100);
    return (
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
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
            {renderBar(item.spent, item.limit)}
          </View>
        );
      })}
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
    color: '#27ae60',
    marginBottom: 8,
  },
  cardOver: {
    fontSize: 14,
    color: '#c0392b',
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#A57C36',
  },
});
