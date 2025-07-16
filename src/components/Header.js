import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function Header({ navigation }) {
  return (
    <View style={styles.headerTop}>
      <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
        <Feather name="user" size={22} color="#A57C36" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.replace('Login')}>
        <Feather name="log-out" size={22} color="#c0392b" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
});