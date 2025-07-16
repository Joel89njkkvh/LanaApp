import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

export default function NavBar({ navigation, active }) {
  return (
    <View style={styles.navContainer}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <MaterialCommunityIcons
          name="speedometer"
          size={20}
          color={active === 'Dashboard' ? '#000' : '#A57C36'}
        />
        <Text style={[styles.navText, active === 'Dashboard' && styles.navActive]}>Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Transaccion')}
      >
        <Feather
          name="menu"
          size={20}
          color={active === 'Transaccion' ? '#000' : '#A57C36'}
        />
        <Text style={[styles.navText, active === 'Transaccion' && styles.navActive]}>Transacciones</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Finanzas')}
      >
        <Feather
          name="trending-up"
          size={20}
          color={active === 'Finanzas' ? '#000' : '#A57C36'}
        />
        <Text style={[styles.navText, active === 'Finanzas' && styles.navActive]}>Finanzas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Presupuesto')}
      >
        <MaterialCommunityIcons
          name="scale-balance"
          size={20}
          color={active === 'Presupuesto' ? '#000' : '#A57C36'}
        />
        <Text style={[styles.navText, active === 'Presupuesto' && styles.navActive]}>Presupuestos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
    minWidth: 80,
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
});