import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';

const { height, width } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.45;

export default function WelcomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Imagen de fondo con overlay y contenido de bienvenida */}
      <ImageBackground
        source={require('../assets/fondo.png')}
        style={[styles.header, { height: HEADER_HEIGHT }]}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.overlayContent}>
            <Text style={styles.title}>Bienvenido a Lana App</Text>
            <Text style={styles.subtitle}>
              Gestión financiera inteligente y sencilla para todos.
            </Text>

            {/* Botones de navegación */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={styles.primaryText}>Regístrate gratis</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.secondaryText}>Inicia sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>

      {/* Estadísticas o testimonios */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Usuarios satisfechos</Text>
          <Text style={styles.statValue}>+10,000</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Reseñas positivas</Text>
          <Text style={styles.statValue}>4.8/5</Text>
        </View>
      </View>

      {/* Imagen inferior decorativa */}
      <Image
        source={require('../assets/finanzas.jpg')}
        style={styles.bottomImage}
        resizeMode="cover"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FBFAF7',
  },
  header: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#FBFAF7',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContent: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#f0f0f0',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12, 
  },
  primaryButton: {
    backgroundColor: '#00a86b',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 100,
    margin: 5,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#00a86b',
    margin: 5,
  },
  secondaryText: {
    color: '#00a86b',
    fontWeight: '600',
    fontSize: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 16,
    paddingVertical: 28,
    paddingHorizontal: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 16,
    alignItems: 'center',
    minWidth: width * 0.42,
    maxWidth: width * 0.46,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1c1c1c',
  },
  bottomImage: {
    width: '100%',
    height: height * 0.38,
  },
});
