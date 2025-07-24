import React, { useState } from 'react';
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
  const [categoriaId, setCategoriaId] = useState('0');

  const handleSave = async () => {
    if (!descripcion || !monto || !tipo) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      const nuevaTransaccion = {
        descripcion,
        monto: parseFloat(monto),
        tipo: tipo.toLowerCase(),
        fecha: new Date().toISOString().split('T')[0],
        categoria_id: parseInt(categoriaId),
        usuario_id: user.id,
      };

      await api.post('/transacciones/', nuevaTransaccion);

      setDescripcion('');
      setMonto('');
      setTipo('');
      setCategoriaId('0');

      onClose();
    } catch (error) {
      console.error('Error al guardar la transacción:', error);
      Alert.alert('Error', 'No se pudo guardar la transacción');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Nueva Transacción</Text>

          <TextInput
            placeholder="Descripción"
            style={styles.input}
            value={descripcion}
            onChangeText={setDescripcion}
          />

          <TextInput
            placeholder="Monto"
            style={styles.input}
            keyboardType="numeric"
            value={monto}
            onChangeText={setMonto}
          />

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tipo}
              onValueChange={(itemValue) => setTipo(itemValue)}
            >
              <Picker.Item label="Selecciona tipo" value="" />
              <Picker.Item label="Ingreso" value="ingreso" />
              <Picker.Item label="Egreso" value="egreso" />
            </Picker>
          </View>

          <TextInput
            placeholder="ID de Categoría (opcional)"
            style={styles.input}
            keyboardType="numeric"
            value={categoriaId}
            onChangeText={setCategoriaId}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
});
