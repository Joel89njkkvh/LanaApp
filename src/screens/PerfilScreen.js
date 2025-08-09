import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import globalStyles from '../styles/globalStyles';
import colors from '../config/colors';
import { API_BASE_URL } from '../config/apiConfig';

export default function PerfilScreen({ navigation }) {
  const [userData, setUserData] = useState({
    id: null,
    nombre: '',
    email: '',
    fecha_registro: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Opción 1: Intentar obtener datos del AsyncStorage
      const storedUser = await AsyncStorage.getItem('user');
      const storedUserId = await AsyncStorage.getItem('userId');
      
      if (storedUser) {
        // Si tienes datos completos en el storage
        const userData = JSON.parse(storedUser);
        setUserData({
          id: userData.id || userData.usuario_id,
          nombre: userData.nombre || userData.name || 'Usuario',
          email: userData.email || userData.correo || 'No disponible',
          fecha_registro: userData.fecha_registro || userData.created_at || 'No disponible'
        });
      } else if (storedUserId) {
        // Opción 2: Si solo tienes ID, hacer petición al backend
        await fetchUserData(parseInt(storedUserId));
      } else {
        Alert.alert('Error', 'No se pudo cargar la información del usuario');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Error al cargar los datos del usuario');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener datos del usuario desde el backend
  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuario/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserData({
          id: data.id,
          nombre: data.nombre || 'Usuario',
          email: data.email || 'No disponible',
          fecha_registro: data.fecha_registro_formato || data.fecha_registro || 'No disponible'
        });
      } else {
        // Si no existe el endpoint, usar datos básicos
        setUserData({
          id: userId,
          nombre: 'Usuario',
          email: 'No disponible',
          fecha_registro: 'No disponible'
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback: usar datos básicos
      setUserData({
        id: userId,
        nombre: 'Usuario',
        email: 'No disponible',
        fecha_registro: 'No disponible'
      });
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['user', 'userId', 'token']);
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <ScrollView style={globalStyles.screen}>
        <Header navigation={navigation} />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={globalStyles.screen}>
      <Header navigation={navigation} />
      
      <View style={styles.profileContainer}>
        <Text style={styles.title}>Perfil del Usuario</Text>
        
        {/* Avatar placeholder */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userData.nombre.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Información del usuario */}
        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>ID de Usuario</Text>
            <Text style={styles.infoValue}>#{userData.id}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Nombre</Text>
            <Text style={styles.infoValue}>{userData.nombre}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{userData.email}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Fecha de Registro</Text>
            <Text style={styles.infoValue}>{userData.fecha_registro}</Text>
          </View>
        </View>

        {/* Botones de acción */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => Alert.alert('Info', 'Función de editar próximamente')}
          >
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1F1F1F',
    marginBottom: 30,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary || '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  infoContainer: {
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  actionsContainer: {
    gap: 12,
    paddingBottom: 30,
  },
  editButton: {
    backgroundColor: colors.primary || '#4ECDC4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  logoutButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
});