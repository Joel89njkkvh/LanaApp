import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext'; // ← Usar AuthContext

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Usar el contexto de autenticación
  const { register, loading } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      const userData = {
        nombre: name,
        correo: email,
        contraseña: password,
      };

      const result = await register(userData);
      
      if (result.success) {
        // La navegación se maneja automáticamente en el AuthContext
        Alert.alert('Registro exitoso', `Bienvenido, ${name}`);
      } else {
        Alert.alert('Error', result.error || 'No se pudo registrar el usuario');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      Alert.alert('Error', 'Ocurrió un error al registrar el usuario');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.headerSection}>
          <Text style={styles.title}>Crea tu cuenta</Text>
          <Text style={styles.subtitle}>Únete a LanaApp</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre completo</Text>
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Ingresa tu nombre"
              placeholderTextColor="#cba07c"
              style={styles.input}
              value={name}
              onChangeText={setName}
              editable={!loading}
            />
            <Ionicons name="person-outline" size={24} color="#cba07c" />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo electrónico</Text>
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Ingresa tu correo"
              placeholderTextColor="#cba07c"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
            <Ionicons name="mail-outline" size={24} color="#cba07c" />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Crea una contraseña"
              placeholderTextColor="#cba07c"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
            <Ionicons name="lock-closed-outline" size={24} color="#cba07c" />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Registrarme</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Login')}
          disabled={loading}
        >
          <Text style={styles.footerText}>
            ¿Ya tienes cuenta? <Text style={styles.footerLink}>Inicia sesión</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#fff' },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerSection: { marginBottom: 36 },
  title: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1c1c1c',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  inputGroup: { marginBottom: 22 },
  label: {
    fontSize: 16,
    color: '#1c1c1c',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#f2e5d6',
    backgroundColor: '#fff9f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 14,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#333',
  },
  button: {
    backgroundColor: '#00a86b',
    paddingVertical: 18,
    borderRadius: 100,
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 28,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 15,
    color: '#777',
    textAlign: 'center',
  },
  footerLink: {
    color: '#00a86b',
    fontWeight: '600',
  },
});