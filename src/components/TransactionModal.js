import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // ✅ IMPORTACIÓN CORRECTA
import colors from '../config/colors';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function TransactionModal({ visible, onClose }) {
  const { user } = useAuth();

  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [tipo, setTipo] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    if (!visible) return;

    const fetchCategorias = async () => {
      try {
        const res = await api.get(`/categorias/?usuario_id=${user.id}`);
        setCategorias(res.data);
        if (res.data.length > 0) {
          setCategoriaId(String(res.data[0].id));
        }
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        Alert.alert('Error', 'No se pudieron cargar las categorías');
      }
    };

    fetchCategorias();
  }, [visible]);

  const handleSave = async () => {
    if (!descripcion || !monto || !tipo || !categoriaId) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    const nuevaTransaccion = {
      descripcion,
      monto: parseFloat(monto),
      tipo: tipo.toLowerCase(),
      fecha: new Date().toISOString().split('T')[0],
      categoria_id: parseInt(categoriaId),
    };

    try {
      console.log("Transacción a enviar:", nuevaTransaccion);
      await api.post(`/transacciones/?usuario_id=${user.id}`, nuevaTransaccion);
      Alert.alert('Éxito', 'Transacción guardada correctamente');
      onClose();
    } catch (error) {
      console.error('Error al guardar:', error.response?.data || error.message);
      Alert.alert('Error', 'No se pudo guardar la transacción');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Nueva Transacción</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              placeholderTextColor="#cba07c"
              value={descripcion}
              onChangeText={setDescripcion}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Monto</Text>
            <TextInput
              style={styles.input}
              placeholder="$0.00"
              keyboardType="numeric"
              placeholderTextColor="#cba07c"
              value={monto}
              onChangeText={setMonto}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo</Text>
            <TextInput
              style={styles.input}
              placeholder="ingreso / egreso"
              placeholderTextColor="#cba07c"
              value={tipo}
              onChangeText={setTipo}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoría</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={categoriaId}
                onValueChange={(itemValue) => setCategoriaId(itemValue)}
              >
                {categorias.map((cat) => (
                  <Picker.Item
                    key={cat.id}
                    label={`${cat.nombre} (${cat.tipo})`}
                    value={String(cat.id)}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#f2e5d6',
    backgroundColor: '#fff9f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#f2e5d6',
    borderRadius: 12,
    backgroundColor: '#fff9f5',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 12,
  },
});
