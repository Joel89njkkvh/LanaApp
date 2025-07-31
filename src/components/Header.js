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
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import colors from '../config/colors';

export default function Header({ 
  navigation, 
  title, 
  showBackButton = false, 
  showProfileActions = true,
  rightComponent,
  onBackPress 
}) {
  const [profileVisible, setProfileVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-Dimensions.get('window').width / 2)).current;
  const { logout } = useAuth();

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
      { text: 'Aceptar', onPress: () => logout() },
    ]);
  };

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation?.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          {/* Sección izquierda */}
          <View style={styles.leftSection}>
            {showBackButton && navigation?.canGoBack() && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackPress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Sección central */}
          <View style={styles.centerSection}>
            {title && (
              <Text style={styles.headerTitle} numberOfLines={1}>
                {title}
              </Text>
            )}
          </View>

          {/* Sección derecha */}
          <View style={styles.rightSection}>
            {rightComponent ? (
              rightComponent
            ) : showProfileActions ? (
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.actionButton} onPress={openProfile}>
                  <Feather name="user" size={22} color="#A57C36" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
                  <Feather name="log-out" size={22} color="#c0392b" />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      </SafeAreaView>

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
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    minHeight: 56,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  // Estilos del modal (mantienes los originales)
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