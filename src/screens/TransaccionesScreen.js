import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import Card from '../components/Card';
import globalStyles from '../styles/globalStyles';
import colors from '../config/colors';

export default function TransaccionesScreen({ navigation }) {
  const transactions = [
    { date: 'Ene 15', type: 'Ingreso', amount: 300 },
    { date: 'Ene 12', type: 'Egreso', amount: 200 },
    { date: 'Ene 10', type: 'Ingreso', amount: 500 },
    { date: 'Ene 08', type: 'Egreso', amount: 100 },
  ];

  return (
    <ScrollView style={globalStyles.screen}>
      <Header navigation={navigation} />
      {/* TÍTULO */}
      <Text style={styles.title}>Transacciones - Enero 2025</Text>

      {/* TARJETAS RESUMEN */}
      <View style={styles.cardGrid}>
        <Card title="Ingresos" value={2000} valueColor={colors.positive} />
        <Card title="Egresos" value={1500} valueColor={colors.negative} />
        <Card title="Saldo" value={500} wide />
      </View>

      {/* LISTA DE TRANSACCIONES */}
      <Text style={styles.sectionTitle}>Historial</Text>
      <View style={styles.transactionList}>
        {transactions.map((tx, index) => (
          <View key={index} style={styles.transactionItem}>
            <View>
              <Text style={styles.transactionDate}>{tx.date}</Text>
              <Text
                style={
                  tx.type === 'Ingreso'
                    ? styles.transactionTypeIn
                    : styles.transactionTypeOut
                }
              >
                {tx.type}
              </Text>
            </View>
            <Text style={styles.transactionAmount}>${tx.amount.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* BOTÓN */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Agregar transacción</Text>
      </TouchableOpacity>
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
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#1F1F1F',
  },
  transactionList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    marginBottom: 40,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  transactionDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  transactionTypeIn: {
    fontSize: 13,
    color: colors.positive,
    marginTop: 2,
  },
  transactionTypeOut: {
    fontSize: 13,
    color: colors.negative,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F1F1F',
    alignSelf: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
