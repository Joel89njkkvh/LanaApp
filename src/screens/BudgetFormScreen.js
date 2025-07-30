import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Header from '../components/Header';
import globalStyles from '../styles/globalStyles';
import colors from '../config/colors';
import { presupuestosService } from '../services/presupuestoService';
import { useAuth } from '../context/AuthContext'; // Importar AuthContext

export default function BudgetFormScreen({ navigation, route }) {
  const { user } = useAuth(); // Obtener usuario del contexto
  const { budget, onBudgetCreated, onBudgetUpdated } = route.params || {};
  const isEditing = !!budget;

  const [formData, setFormData] = useState({
    monto: budget?.monto?.toString() || '',
    mes: budget?.mes || new Date().getMonth() + 1,
    año: budget?.año || new Date().getFullYear(),
    categoria_id: budget?.categoria_id || 1,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await presupuestosService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      newErrors.monto = 'El monto debe ser mayor a 0';
    }

    if (!formData.mes || formData.mes < 1 || formData.mes > 12) {
      newErrors.mes = 'Selecciona un mes válido';
    }

    if (!formData.año || formData.año < 2020 || formData.año > 2030) {
      newErrors.año = 'El año debe estar entre 2020 y 2030';
    }

    if (!formData.categoria_id) {
      newErrors.categoria_id = 'Selecciona una categoría';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'No se pudo identificar el usuario');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await presupuestosService.updateBudget(budget.id, formData);
        Alert.alert('Éxito', 'Presupuesto actualizado correctamente');
        onBudgetUpdated?.();
      } else {
        await presupuestosService.createBudget(user.id, formData);
        Alert.alert('Éxito', 'Presupuesto creado correctamente');
        onBudgetCreated?.();
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo guardar el presupuesto');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este presupuesto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await presupuestosService.deleteBudget(budget.id);
              Alert.alert('Éxito', 'Presupuesto eliminado correctamente');
              onBudgetUpdated?.();
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el presupuesto');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  return (
    <ScrollView style={globalStyles.screen}>
      <Header navigation={navigation} />
      
      <Text style={styles.title}>
        {isEditing ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
      </Text>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Monto del Presupuesto</Text>
          <TextInput
            style={[styles.input, errors.monto && styles.inputError]}
            value={formData.monto}
            onChangeText={(value) => updateFormData('monto', value)}
            placeholder="Ej: 1000"
            keyboardType="numeric"
          />
          {errors.monto && <Text style={styles.errorText}>{errors.monto}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Categoría</Text>
          <View style={[styles.pickerContainer, errors.categoria_id && styles.inputError]}>
            <Picker
              selectedValue={formData.categoria_id}
              style={styles.picker}
              onValueChange={(value) => updateFormData('categoria_id', value)}
            >
              {categories.map((category) => (
                <Picker.Item
                  key={`category-${category.id}`}
                  label={category.nombre}
                  value={category.id}
                />
              ))}
            </Picker>
          </View>
          {errors.categoria_id && <Text style={styles.errorText}>{errors.categoria_id}</Text>}
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Mes</Text>
            <View style={[styles.pickerContainer, errors.mes && styles.inputError]}>
              <Picker
                selectedValue={formData.mes}
                style={styles.picker}
                onValueChange={(value) => updateFormData('mes', value)}
              >
                {months.map((month) => (
                  <Picker.Item
                    key={`month-${month.value}`}
                    label={month.label}
                    value={month.value}
                  />
                ))}
              </Picker>
            </View>
            {errors.mes && <Text style={styles.errorText}>{errors.mes}</Text>}
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Año</Text>
            <TextInput
              style={[styles.input, errors.año && styles.inputError]}
              value={formData.año.toString()}
              onChangeText={(value) => updateFormData('año', parseInt(value) || 2024)}
              placeholder="2024"
              keyboardType="numeric"
              maxLength={4}
            />
            {errors.año && <Text style={styles.errorText}>{errors.año}</Text>}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Presupuesto')}
          </Text>
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity
            style={[styles.deleteButton, loading && styles.buttonDisabled]}
            onPress={handleDelete}
            disabled={loading}
          >
            <Text style={styles.deleteButtonText}>Eliminar Presupuesto</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    color: '#1F1F1F',
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: colors.negative,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 200 : 50,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  errorText: {
    color: colors.negative,
    fontSize: 12,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: colors.negative,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});