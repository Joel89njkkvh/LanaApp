import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';

export default function PerfilScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <Text style={styles.title}>Perfil del Usuario</Text>
      {/* Aquí iría la info del usuario */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#FBFAF7',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1F1F1F',
  },
});
