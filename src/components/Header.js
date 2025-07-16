import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function Header({ navigation }) {
  const [profileVisible, setProfileVisible] = useState(false);
  return (
    <>
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={() => setProfileVisible(true)}>
          <Feather name="user" size={22} color="#A57C36" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Feather name="log-out" size={22} color="#c0392b" />
        </TouchableOpacity>
      </View>
      <Modal
        visible={profileVisible}
        animationType="slide"
        onRequestClose={() => setProfileVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => setProfileVisible(false)}
          >
            <Feather name="x" size={24} color="#A57C36" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Perfil del Usuario</Text>
          {/* Aquí iría la info del usuario */}
        </View>
      </Modal>
    </>
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
  modalContainer: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#FBFAF7',
  },
  closeIcon: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1F1F1F',
  },
});
