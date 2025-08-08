import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '../components/Header';
import globalStyles from '../styles/globalStyles';
import colors from '../config/colors';
import { pagosService } from '../services/pagoService';
import { useAuth } from '../context/AuthContext';

export default function CreatePaymentScreen({ navigation, route }) {
  const { user } = useAuth();
  const { payment } = route.params || {};
  const isEditing = !!payment;

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    monto: '',
    categoria_id: '',
    fecha: new Date(),
    estado: 'pendiente', // ✅ Valor válido por defecto
    descripcion: '',
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});
  const [categoriesError, setCategoriesError] = useState(false);

  // Función helper para navegar a PagosScreen
  const navigateToPagos = () => {
    navigation.navigate('MainTabs', { 
      screen: 'PagosScreen', 
      params: { refresh: true } 
    });
  };

  // Cargar categorías al montar el componente
  useEffect(() => {
    loadCategories();
    if (isEditing && payment) {
      // Mapear estados que puedan venir del backend
      const mapEstado = (estado) => {
        const estadoMapping = {
          'completado': 'pagado',
          'pagado': 'pagado',
          'pendiente': 'pendiente',
          'cancelado': 'cancelado'
        };
        return estadoMapping[estado] || 'pendiente';
      };

      setFormData({
        nombre: payment.nombre || '',
        monto: payment.monto?.toString() || '',
        categoria_id: payment.categoria_id || '',
        fecha: new Date(payment.fecha) || new Date(),
        estado: mapEstado(payment.estado) || 'pendiente',
        descripcion: payment.descripcion || '',
      });
    }
  }, [isEditing, payment]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      setCategoriesError(false);
      console.log('Cargando categorías...');
      
      // Si quieres solo categorías de egreso para pagos, descomenta la siguiente línea:
      // const categoriesData = await pagosService.getCategoriesByType('egreso');
      // O para todas las categorías:
      const categoriesData = await pagosService.getCategories();
      
      console.log('Categorías cargadas:', categoriesData);
      
      if (categoriesData && categoriesData.length > 0) {
        setCategories(categoriesData);
      } else {
        // Si no se obtienen categorías, usar las hardcodeadas
        console.log('No se obtuvieron categorías, usando fallback');
        const fallbackCategories = pagosService.getCategoriesHardcoded();
        setCategories(fallbackCategories);
        setCategoriesError(true);
      }
    } catch (error) {
      console.error('Error cargando categorías:', error);
      setCategoriesError(true);
      
      // Usar categorías hardcodeadas como fallback
      const fallbackCategories = pagosService.getCategoriesHardcoded();
      setCategories(fallbackCategories);
      
      Alert.alert(
        'Advertencia', 
        'No se pudieron cargar las categorías desde el servidor. Se están usando categorías predeterminadas.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleInputChange('fecha', selectedDate);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.monto.trim()) {
      newErrors.monto = 'El monto es requerido';
    } else if (isNaN(parseFloat(formData.monto)) || parseFloat(formData.monto) <= 0) {
      newErrors.monto = 'El monto debe ser un número válido mayor a 0';
    }

    if (!formData.categoria_id) {
      newErrors.categoria_id = 'La categoría es requerida';
    }

    // Validar estado
    const estadosValidos = ['pendiente', 'pagado', 'cancelado'];
    if (!estadosValidos.includes(formData.estado)) {
      newErrors.estado = 'Estado inválido';
    }

    // Validar que el usuario esté autenticado
    if (!user?.id) {
      newErrors.usuario = 'Usuario no autenticado';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Por favor corrige los errores en el formulario');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'No hay usuario autenticado');
      return;
    }

    try {
      setLoading(true);

      const paymentData = {
        nombre: formData.nombre.trim(),
        monto: parseFloat(formData.monto),
        categoria_id: parseInt(formData.categoria_id), // Asegurar que sea un número
        fecha: formData.fecha.toISOString().split('T')[0], // Formato YYYY-MM-DD
        estado: formData.estado,
        descripcion: formData.descripcion.trim(),
        usuario_id: user.id, // IMPORTANTE: Asegurar que el usuario_id esté incluido
      };

      console.log('Datos del pago a enviar:', paymentData);
      console.log('Usuario actual:', user);

      if (isEditing) {
        await pagosService.updatePayment(payment.id, paymentData);
        Alert.alert('Éxito', 'Pago actualizado correctamente', [
          {
            text: 'OK',
            onPress: () => {
              navigateToPagos();
            },
          },
        ]);
      } else {
        await pagosService.createPayment(paymentData);
        Alert.alert('Éxito', 'Pago creado correctamente', [
          {
            text: 'OK',
            onPress: () => {
              navigateToPagos();
            },
          },
        ]);
      }
    } catch (error) {
      console.error('Error guardando pago:', error);
      Alert.alert('Error', `No se pudo guardar el pago: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este pago?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await pagosService.deletePayment(payment.id);
              Alert.alert('Éxito', 'Pago eliminado correctamente', [
                {
                  text: 'OK',
                  onPress: () => {
                    navigateToPagos();
                  },
                },
              ]);
            } catch (error) {
              console.error('Error eliminando pago:', error);
              Alert.alert('Error', 'No se pudo eliminar el pago');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loadingCategories) {
    return (
      <ScrollView style={globalStyles.screen}>
        <Header 
          navigation={navigation} 
          showBackButton={true}
          showProfileActions={false}
          title={isEditing ? 'Editar Pago' : 'Nuevo Pago'}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando categorías...</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={globalStyles.screen}>
      <Header 
        navigation={navigation} 
        showBackButton={true}
        showProfileActions={false}
        title={isEditing ? 'Editar Pago' : 'Nuevo Pago'}
      />

      <View style={styles.form}>
        {/* Mensaje de advertencia si hay error con categorías */}
        {categoriesError && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>
              ⚠️ Se están usando categorías predeterminadas. Verifica tu conexión.
            </Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={loadCategories}
            >
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Nombre */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre del Pago</Text>
          <TextInput
            style={[styles.input, errors.nombre && styles.inputError]}
            value={formData.nombre}
            onChangeText={(value) => handleInputChange('nombre', value)}
            placeholder="Ej: Renta, Electricidad, etc."
            placeholderTextColor={colors.neutral}
          />
          {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
        </View>

        {/* Monto */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Monto</Text>
          <TextInput
            style={[styles.input, errors.monto && styles.inputError]}
            value={formData.monto}
            onChangeText={(value) => handleInputChange('monto', value)}
            placeholder="0.00"
            placeholderTextColor={colors.neutral}
            keyboardType="numeric"
          />
          {errors.monto && <Text style={styles.errorText}>{errors.monto}</Text>}
        </View>

        {/* Categoría */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Categoría</Text>
          <View style={[styles.pickerContainer, errors.categoria_id && styles.inputError]}>
            <Picker
              selectedValue={formData.categoria_id}
              onValueChange={(value) => handleInputChange('categoria_id', value)}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona una categoría" value="" />
              {categories.map((category) => (
                <Picker.Item
                  key={category.id || category.nombre}
                  label={`${category.nombre} (${category.tipo})`}
                  value={category.id ? category.id.toString() : category.nombre}
                />
              ))}
            </Picker>
          </View>
          {errors.categoria_id && <Text style={styles.errorText}>{errors.categoria_id}</Text>}
        </View>

        {/* Fecha */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fecha</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>{formatDate(formData.fecha)}</Text>
          </TouchableOpacity>
        </View>

        {/* Estado */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Estado</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.estado}
              onValueChange={(value) => handleInputChange('estado', value)}
              style={styles.picker}
            >
              <Picker.Item label="Pendiente" value="pendiente" />
              <Picker.Item label="Pagado" value="pagado" />
              <Picker.Item label="Cancelado" value="cancelado" />
            </Picker>
          </View>
        </View>

        {/* Descripción */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción (Opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.descripcion}
            onChangeText={(value) => handleInputChange('descripcion', value)}
            placeholder="Descripción adicional..."
            placeholderTextColor={colors.neutral}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Botones */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>
                {isEditing ? 'Actualizar Pago' : 'Crear Pago'}
              </Text>
            )}
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity
              style={[styles.button, styles.deleteButton, loading && styles.buttonDisabled]}
              onPress={handleDelete}
              disabled={loading}
            >
              <Text style={styles.deleteButtonText}>Eliminar Pago</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={formData.fecha}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    fontSize: 16,
    color: colors.neutral,
    marginTop: 12,
  },
  form: {
    marginBottom: 40,
  },
  warningContainer: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFEAA7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  warningText: {
    color: '#856404',
    fontSize: 14,
    flex: 1,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F1F1F',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  inputError: {
    borderColor: colors.negative,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  picker: {
    height: 50,
  },
  dateButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#1F1F1F',
  },
  errorText: {
    color: colors.negative,
    fontSize: 14,
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 32,
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: colors.negative,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.neutral,
  },
  cancelButtonText: {
    color: colors.neutral,
    fontSize: 16,
    fontWeight: '600',
  },
});