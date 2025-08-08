import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Text,
  Animated,
  TouchableWithoutFeedback,
  Alert,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import colors from '../config/colors';

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

function Header({
  navigation,
  title,
  showBackButton = false,
  showProfileActions = true,
  rightComponent,
  onBackPress,
}) {
  const [profileVisible, setProfileVisible] = useState(false);
  const { width } = useWindowDimensions();
  const panelWidth = Math.round(width / 2);

  const slideAnim = useRef(new Animated.Value(-panelWidth)).current;
  const { logout } = useAuth();

  useEffect(() => {
    if (!profileVisible) slideAnim.setValue(-panelWidth);
  }, [panelWidth, profileVisible, slideAnim]);

  const openProfile = useCallback(() => {
    setProfileVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const closeProfile = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: -panelWidth,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setProfileVisible(false));
  }, [panelWidth, slideAnim]);

  const handleLogout = useCallback(() => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Aceptar',
        onPress: async () => {
          try {
            await logout();             // Limpia tokens/estado
            setProfileVisible(false);   // Cierra el modal si estaba abierto
            navigation?.reset({         // Envía a Login y limpia el stack
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } catch (e) {
            console.log('Error en logout:', e);
            Alert.alert('Error', 'No se pudo cerrar sesión.');
          }
        },
      },
    ]);
  }, [logout, navigation]);

  const handleBackPress = useCallback(() => {
    if (onBackPress) onBackPress();
    else if (navigation?.canGoBack()) navigation.goBack();
  }, [navigation, onBackPress]);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          {/* Izquierda */}
          <View style={styles.leftSection}>
            {showBackButton && navigation?.canGoBack() && (
              <TouchableOpacity style={styles.iconPad} onPress={handleBackPress} hitSlop={HIT_SLOP}>
                <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            )}
            {showProfileActions && (
              <TouchableOpacity style={styles.actionButton} onPress={openProfile}>
                <Feather name="user" size={22} color="#A57C36" />
              </TouchableOpacity>
            )}
          </View>

          {/* Centro */}
          <View style={styles.centerSection}>
            {!!title && (
              <Text style={styles.headerTitle} numberOfLines={1}>
                {title}
              </Text>
            )}
          </View>

          {/* Derecha */}
          <View style={styles.rightSection}>
            {rightComponent ? (
              rightComponent
            ) : showProfileActions ? (
              <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
                <Feather name="log-out" size={22} color="#c0392b" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </SafeAreaView>

      {/* Modal lateral de perfil */}
      <Modal visible={profileVisible} transparent onRequestClose={closeProfile}>
        <View style={styles.overlayContainer}>
          <TouchableWithoutFeedback onPress={closeProfile}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[
              styles.modalContainer,
              { width: panelWidth, transform: [{ translateX: slideAnim }] },
            ]}
          >
            <TouchableOpacity style={styles.closeIcon} onPress={closeProfile}>
              <Feather name="x" size={24} color="#A57C36" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Perfil del Usuario</Text>
            {/* Aquí puedes renderizar info del usuario o acciones extra */}
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

export default React.memo(Header);

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    minHeight: 56,
  },
  leftSection: { flexDirection: 'row', alignItems: 'center' },
  centerSection: { flex: 2, alignItems: 'center' },
  rightSection: { flex: 1, alignItems: 'flex-end' },
  iconPad: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary, textAlign: 'center' },
  actionButton: { padding: 8, marginLeft: 4 },

  modalContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#FBFAF7',
  },
  closeIcon: { alignSelf: 'flex-end', marginBottom: 10 },
  modalTitle: { fontSize: 24, fontWeight: '700', textAlign: 'center', color: '#1F1F1F' },
  overlayContainer: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
});
