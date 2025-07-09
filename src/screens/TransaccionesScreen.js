import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TransaccionesScreen({ navigation }) {
  const transactions = [
    { date: 'Ene 15', type: 'Ingreso', amount: 300 },
    { date: 'Ene 12', type: 'Egreso', amount: 200 },
    { date: 'Ene 10', type: 'Ingreso', amount: 500 },
    { date: 'Ene 08', type: 'Egreso', amount: 100 },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* NAV BAR SUPERIOR */}
      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Dashboard')}>
          <MaterialCommunityIcons name="speedometer" size={20} color="#A57C36" />
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Feather name="menu" size={20} color="#000" />
          <Text style={[styles.navText, styles.navActive]}>Transacciones</Text>
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

      {/* TÍTULO */}
      <Text style={styles.title}>Transacciones - Enero 2025</Text>

      {/* TARJETAS RESUMEN */}
      <View style={styles.cardGrid}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ingresos</Text>
          <Text style={[styles.cardValue, { color: '#27ae60' }]}>$2,000.00</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Egresos</Text>
          <Text style={[styles.cardValue, { color: '#c0392b' }]}>$1,500.00</Text>
        </View>

        <View style={styles.cardWide}>
          <Text style={styles.cardTitle}>Saldo</Text>
          <Text style={styles.cardValue}>$500.00</Text>
        </View>
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
  minWidth: 80, // o 90 si aún no cabe
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
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
    color: '#27ae60',
    marginTop: 2,
  },
  transactionTypeOut: {
    fontSize: 13,
    color: '#c0392b',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F1F1F',
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#A57C36',
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
