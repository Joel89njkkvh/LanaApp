import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import Card from '../components/Card';
import BarChart from '../components/BarChart';
import globalStyles from '../styles/globalStyles';
import colors from '../config/colors';

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
    <ScrollView style={globalStyles.screen}>
      <Header navigation={navigation} />
      <NavBar navigation={navigation} active="Finanzas" />

      {/* TITULO */}
      <Text style={styles.title}>Estado Financiero</Text>

      {/* TARJETAS */}
      <View style={styles.cardGrid}>
       <Card title="Inversiones" value={inversiones} change={3} />
        <Card title="Ahorros" value={ahorros} change={2} />
        <Card title="Rendimiento Mensual" value={rendimiento} wide change={4} />
      </View>

      {/* GRAFICO BARRAS - RENDIMIENTO */}
      <BarChart
        data={['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'].map((m, i) => ({
          label: m,
          value: 60 + i * 8,
        }))}
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
