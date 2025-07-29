import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext'; // ← Usar AuthContext

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  
  // Usar el contexto de autenticación
  const { login, loading } = useAuth();

  const togglePassword = () => setSecure(!secure);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      const result = await login(email, password);
      
      if (result.success) {
        // La navegación se maneja automáticamente en el AuthContext
        // No necesitas hacer navigation.reset() aquí
        Alert.alert('Bienvenid@', 'Has iniciado sesión correctamente');
      } else {
        Alert.alert('Error', result.error || 'Credenciales inválidas');
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      Alert.alert('Error', 'Ocurrió un error al iniciar sesión');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.headerSection}>
          <Text style={styles.title}>Bienvenido a LanaApp</Text>
          <Text style={styles.subtitle}>Gestión financiera para todos</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo Electrónico</Text>
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
              placeholder="Ingresa tu contraseña"
              placeholderTextColor="#cba07c"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secure}
              editable={!loading}
            />
            <TouchableOpacity onPress={togglePassword} disabled={loading}>
              <Ionicons name={secure ? 'eye-off-outline' : 'eye-outline'} size={24} color="#cba07c" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Register')}
          disabled={loading}
        >
          <Text style={styles.footerText}>
            ¿No tienes cuenta? <Text style={styles.footerLink}>Regístrate</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => Alert.alert('Recuperación', 'Función no implementada aún')}
          disabled={loading}
        >
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
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
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  footerText: {
    fontSize: 15,
    color: '#777',
    textAlign: 'center',
    marginBottom: 10,
  },
  footerLink: { color: '#00a86b', fontWeight: '600' },
  forgotText: {
    color: '#00a86b',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
});