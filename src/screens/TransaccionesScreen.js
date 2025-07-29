import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Header from '../components/Header';
import Card from '../components/Card';
import globalStyles from '../styles/globalStyles';
import colors from '../config/colors';
import { getTransactions, deleteTransaction } from '../services/transactionService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TransaccionesScreen({ navigation }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
  try {
    setLoading(true);

    const usuarioId = await AsyncStorage.getItem('usuario_id');
    const nombre = await AsyncStorage.getItem('nombre');
    const correo = await AsyncStorage.getItem('correo');

    if (!usuarioId) {
      console.error('⚠️ No se encontró usuario_id en AsyncStorage');
      return;
    }

    const user = {
      usuario_id: usuarioId,
      nombre,
      correo,
    };

    console.log('✅ Usuario cargado correctamente:', user);

    const response = await getTransactions(usuarioId); // 👈 Usa el ID correcto
    setTransactions(response.data);
  } catch (error) {
    console.error('❌ Error al obtener transacciones:', error.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (transaccion_id) => {
    Alert.alert('Eliminar', '¿Seguro que deseas eliminar esta transacción?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTransaction(transaccion_id);
            fetchTransactions();
            Alert.alert('Éxito', 'Transacción eliminada correctamente');
          } catch (error) {
            console.error('Error al eliminar transacción:', error);
            Alert.alert('Error', 'No se pudo eliminar la transacción');
          }
        },
      },
    ]);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchTransactions);
    return unsubscribe;
  }, [navigation]);

  const totalIngresos = transactions
    .filter((tx) => tx.tipo === 'ingreso')
    .reduce((sum, tx) => sum + parseFloat(tx.monto), 0);

  const totalEgresos = transactions
    .filter((tx) => tx.tipo === 'egreso')
    .reduce((sum, tx) => sum + parseFloat(tx.monto), 0);

  const saldo = totalIngresos - totalEgresos;

  return (
    <ScrollView style={globalStyles.screen}>
      <Header navigation={navigation} />
      <Text style={styles.title}>Transacciones</Text>

      <View style={styles.cardGrid}>
        <Card title="Ingresos" value={totalIngresos.toFixed(2)} valueColor={colors.positive} />
        <Card title="Egresos" value={totalEgresos.toFixed(2)} valueColor={colors.negative} />
        <Card title="Saldo" value={saldo.toFixed(2)} wide />
      </View>

      <Text style={styles.sectionTitle}>Historial</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : transactions.length === 0 ? (
        <Text style={styles.noTransactions}>No hay transacciones registradas.</Text>
      ) : (
        <View style={styles.transactionList}>
          {transactions.map((tx) => (
            <TouchableOpacity
              key={tx.transaccion_id || tx.id}
              style={styles.transactionItem}
              onLongPress={() => handleDelete(tx.transaccion_id || tx.id)}
              onPress={() => navigation.navigate('AgregarTransaccion', { transaction: tx })}
            >
              <View>
                <Text style={styles.transactionDate}>
                  {new Date(tx.fecha).toLocaleDateString('es-MX', {
                    day: '2-digit',
                    month: 'short',
                  })}
                </Text>
                <Text style={styles.transactionDescription}>{tx.descripcion}</Text>
                <Text style={tx.tipo === 'ingreso' ? styles.transactionTypeIn : styles.transactionTypeOut}>
                  {tx.tipo.charAt(0).toUpperCase() + tx.tipo.slice(1)}
                </Text>
              </View>
              <Text style={styles.transactionAmount}>
                ${parseFloat(tx.monto).toFixed(2)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AgregarTransaccion')}
      >
        <Text style={styles.addButtonText}>+ Agregar transacción</Text>
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    color: '#1F1F1F',
    paddingHorizontal: 10,
  },
  noTransactions: {
    textAlign: 'center',
    marginVertical: 20,
    color: colors.medium,
  },
  transactionList: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  transactionDescription: {
    fontSize: 14,
    color: colors.dark,
    marginVertical: 2,
  },
  transactionTypeIn: {
    fontSize: 13,
    color: colors.positive,
  },
  transactionTypeOut: {
    fontSize: 13,
    color: colors.negative,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F1F1F',
  },
  addButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 30,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
