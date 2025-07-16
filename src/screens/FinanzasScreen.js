import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import Header from '../components/Header';

const screenWidth = Dimensions.get('window').width;

export default function FinanzasScreen({ navigation }) {
  const [inversiones, setInversiones] = useState(5000);
  const [ahorros, setAhorros] = useState(3000);
  const [rendimiento, setRendimiento] = useState(0);

  useEffect(() => {
    const rendimientoMensual = 450;
    setRendimiento(rendimientoMensual);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Header navigation={navigation} />
      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Dashboard')}>
          <MaterialCommunityIcons name="speedometer" size={20} color="#A57C36" />
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Transaccion')}>
          <Feather name="menu" size={20} color="#A57C36" />
          <Text style={styles.navText}>Transacciones</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Feather name="trending-up" size={20} color="#000" />
          <Text style={[styles.navText, styles.navActive]}>Finanzas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Presupuesto')}>
          <MaterialCommunityIcons name="scale-balance" size={20} color="#A57C36" />
          <Text style={styles.navText}>Presupuestos</Text>
        </TouchableOpacity>
      </View>

      {/* TITULO */}
      <Text style={styles.title}>Estado Financiero</Text>

      {/* TARJETAS */}
      <View style={styles.cardGrid}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Inversiones</Text>
          <Text style={styles.cardValue}>${inversiones}</Text>
          <Text style={styles.cardChangePositive}>+3%</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ahorros</Text>
          <Text style={styles.cardValue}>${ahorros}</Text>
          <Text style={styles.cardChangePositive}>+2%</Text>
        </View>

        <View style={styles.cardWide}>
          <Text style={styles.cardTitle}>Rendimiento Mensual</Text>
          <Text style={styles.cardValue}>${rendimiento}</Text>
          <Text style={styles.cardChangePositive}>Este mes +4%</Text>
        </View>
      </View>

      {/* GRAFICO BARRAS - RENDIMIENTO */}
      <View style={styles.barChart}>
        {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'].map((month, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={[styles.bar, { height: 60 + index * 8 }]} />
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
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 20,
    flexWrap: 'wrap',
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
  },
  cardChangePositive: {
    color: '#27ae60',
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
    backgroundColor: '#A57C36',
    borderRadius: 4,
  },
  barLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#555',
  },
});
