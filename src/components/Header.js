import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Text,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function Header({ navigation }) {
  const [profileVisible, setProfileVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-Dimensions.get('window').width / 2)).current;

  const openProfile = () => {
    setProfileVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeProfile = () => {
    Animated.timing(slideAnim, {
      toValue: -Dimensions.get('window').width / 2,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setProfileVisible(false));
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Aceptar', onPress: () => navigation.replace('home') },
    ]);
  };
  return (
    <View>
      {/* Botones superiores */}
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={openProfile}>
          <Feather name="user" size={22} color="#A57C36" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Feather name="log-out" size={22} color="#c0392b" />
        </TouchableOpacity>
      </View>

      {/* Modal de perfil */}
      <Modal
        visible={profileVisible}
        transparent
        onRequestClose={closeProfile}
      >
        <View style={styles.overlayContainer}>
          <TouchableWithoutFeedback onPress={closeProfile}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>

          <Animated.View style={[styles.modalContainer, { transform: [{ translateX: slideAnim }] }]}>
            <TouchableOpacity style={styles.closeIcon} onPress={closeProfile}>
              <Feather name="x" size={24} color="#A57C36" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Perfil del Usuario</Text>
          </Animated.View>
        </View>
      </Modal>
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
  modalContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: Dimensions.get('window').width / 2,
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
  overlayContainer: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});
