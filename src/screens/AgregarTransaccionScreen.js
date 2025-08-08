import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createTransaction, updateTransaction } from '../services/transactionService';
import globalStyles from '../styles/globalStyles';
import colors from '../config/colors';
import api from '../api';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

// Mapeo de categorías para enviar ID correcto al backend
const CATEGORY_MAPPING = {
  'Alimentos': 1,
  'Transporte': 2,
  'Vivienda': 3,
  'Entretenimiento': 4,
  'Salud': 5,
  'Educación': 6,
  'Salario': 7,
  'Bonos': 8,
  'Inversiones': 9,
  'Otros ingresos': 10
};

export default function AgregarTransaccionScreen({ navigation, route }) {
  const [form, setForm] = useState({
    monto: '',
    tipo: 'ingreso',
    fecha: new Date().toISOString().split('T')[0],
    descripcion: '',
    categoria_id: null,
    usuario_id: null,
    transaccion_id: null,
  });

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [usuarioCargado, setUsuarioCargado] = useState(false);
  const [inicializacionCompleta, setInicializacionCompleta] = useState(false);

  const loadCategorias = useCallback(async (tipo, categoriaExistente = null) => {
    try {
      setLoadingCategorias(true);
      const response = await api.get(`/categorias/?tipo=${tipo}`);
      
      if (response.data && Array.isArray(response.data)) {
        const categoriasConId = response.data.map((categoria) => ({
          ...categoria,
          id: CATEGORY_MAPPING[categoria.nombre] || categoria.nombre
        }));

        setCategorias(categoriasConId);

        if (categoriaExistente) {
          let categoriaValida = categoriasConId.find(cat => cat.id === categoriaExistente);
          if (!categoriaValida) {
            categoriaValida = categoriasConId.find(cat => cat.nombre === categoriaExistente);
          }

          if (categoriaValida) {
            setForm(prev => ({
              ...prev,
              categoria_id: categoriaValida.nombre
            }));
          } else {
            setForm(prev => ({ ...prev, categoria_id: null }));
          }
        }
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      Alert.alert('Error', 'No se pudieron cargar las categorías');
      setCategorias([]);
      setForm(prev => ({ ...prev, categoria_id: null }));
    } finally {
      setLoadingCategorias(false);
    }
  }, []);

  const cargarUsuario = useCallback(async () => {
  try {
    const usuarioId = await AsyncStorage.getItem('usuario_id');
    if (usuarioId) {
      setForm(prev => ({ ...prev, usuario_id: parseInt(usuarioId) }));
      setUsuarioCargado(true);
      return parseInt(usuarioId);
    }

    if (route.params?.usuario) {
      const userId = route.params.usuario.usuario_id || route.params.usuario.id;
      if (userId) {
        setForm(prev => ({ ...prev, usuario_id: parseInt(userId) }));
        setUsuarioCargado(true);
        await AsyncStorage.setItem('usuario_id', String(userId)); // opcional
        return parseInt(userId);
      }
    }

    if (route.params?.transaction?.usuario_id) {
      const userId = route.params.transaction.usuario_id;
      setForm(prev => ({ ...prev, usuario_id: parseInt(userId) }));
      setUsuarioCargado(true);
      return parseInt(userId);
    }

    Alert.alert('Error de Usuario', 'No se pudo cargar la información del usuario.');
    return null;
  } catch (error) {
    console.error('Error al cargar usuario:', error);
    Alert.alert('Error', 'Ocurrió un error al cargar la información del usuario.');
    return null;
  }
}, [route.params]);

  useEffect(() => {
    const inicializar = async () => {
      const userId = await cargarUsuario();
      let tipoInicial = 'ingreso';
      let categoriaExistente = null;

      if (route.params?.transaction) {
        const tx = route.params.transaction;
        setIsEdit(true);
        tipoInicial = tx.tipo || 'ingreso';
        categoriaExistente = tx.categoria_id;

        setForm(prev => ({
          ...prev,
          monto: tx.monto?.toString() || '',
          tipo: tipoInicial,
          fecha: tx.fecha || new Date().toISOString().split('T')[0],
          descripcion: tx.descripcion || '',
          categoria_id: categoriaExistente,
          transaccion_id: tx.transaccion_id || tx.id || null,
          usuario_id: tx.usuario_id || userId || prev.usuario_id,
        }));

        if (tx.fecha) {
          setSelectedDate(new Date(tx.fecha));
        }
      }

      await loadCategorias(tipoInicial, categoriaExistente);
      setInicializacionCompleta(true);
    };

    inicializar();
  }, [route.params, cargarUsuario, loadCategorias]);

  useEffect(() => {
    if (inicializacionCompleta && form.tipo) {
      loadCategorias(form.tipo);
    }
  }, [form.tipo, inicializacionCompleta, loadCategorias]);

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      setForm(prev => ({
        ...prev,
        fecha: moment(date).format('YYYY-MM-DD')
      }));
    }
  };

  const handleGoBack = () => {
    // Regresar al Tab Navigator donde está TransaccionesScreen
    try {
      const parentNavigator = navigation.getParent();
      if (parentNavigator) {
        parentNavigator.goBack();
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Navigation error:', error);
      navigation.goBack();
    }
  };

  const isFormValid = () => {
    return (
      form.usuario_id &&
      form.monto && 
      !isNaN(parseFloat(form.monto)) && 
      parseFloat(form.monto) > 0 &&
      form.categoria_id &&
      ['ingreso', 'egreso'].includes(form.tipo) &&
      form.fecha &&
      (!form.descripcion || form.descripcion.length <= 200)
    );
  };

  const validateAndSubmit = () => {
    if (!form.usuario_id) {
      Alert.alert('Error', 'Error de autenticación. No se pudo verificar su identidad.');
      return;
    }
    if (!form.monto || isNaN(parseFloat(form.monto)) || parseFloat(form.monto) <= 0) {
      Alert.alert('Error', 'Ingrese un monto válido mayor a 0.');
      return;
    }
    if (!form.categoria_id) {
      Alert.alert('Error', 'Seleccione una categoría.');
      return;
    }
    if (!['ingreso', 'egreso'].includes(form.tipo)) {
      Alert.alert('Error', 'Tipo de transacción inválido.');
      return;
    }
    if (!form.fecha) {
      Alert.alert('Error', 'Seleccione una fecha válida.');
      return;
    }
    if (form.descripcion && form.descripcion.length > 200) {
      Alert.alert('Error', 'La descripción no puede exceder 200 caracteres.');
      return;
    }
    
    // Si todas las validaciones pasan, ejecutar el submit
    handleSubmit();
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);
      const categoryId = CATEGORY_MAPPING[form.categoria_id];
      if (!categoryId) throw new Error('Categoría no válida');

      const transactionData = {
        monto: parseFloat(form.monto),
        tipo: form.tipo,
        fecha: form.fecha,
        descripcion: form.descripcion.trim() || null,
        categoria_id: categoryId,
        usuario_id: parseInt(form.usuario_id),
      };

      let resultado;
      if (isEdit && form.transaccion_id) {
        resultado = await updateTransaction(form.transaccion_id, transactionData);
      } else {
        const { usuario_id, ...dataParaEnviar } = transactionData;
        resultado = await createTransaction(usuario_id, dataParaEnviar);
      }

      // Mostrar alert de éxito independientemente de la estructura de la respuesta
      const mensaje = isEdit
        ? 'La transacción fue actualizada correctamente.'
        : 'La transacción fue creada exitosamente.';

      console.log('Resultado de la transacción:', resultado); // Para debug

      Alert.alert('Éxito', mensaje, [
        {
          text: 'OK',
          onPress: () => {
            // Regresar al Tab Navigator donde está TransaccionesScreen
            try {
              const parentNavigator = navigation.getParent();
              if (parentNavigator) {
                parentNavigator.goBack();
              } else {
                navigation.goBack();
              }
            } catch (error) {
              console.error('Navigation error:', error);
              navigation.goBack();
            }
          },
        },
      ]);

    } catch (error) {
      console.error('Error en handleSubmit:', error);
      let mensajeError = 'Error al procesar la transacción.';
      if (error.response?.status === 422) {
        mensajeError = 'Datos inválidos. Verifica los campos.';
      } else if (error.message.includes('Categoría no válida')) {
        mensajeError = 'La categoría seleccionada no es válida.';
      } else if (error.message.includes('Network Error')) {
        mensajeError = 'Error de red. Verifique su conexión.';
      }
      Alert.alert('Error', mensajeError);
    } finally {
      setLoading(false);
    }
  };

  if (!inicializacionCompleta) {
    return (
      <View style={[globalStyles.screen, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Inicializando...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView 
        style={globalStyles.screen}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header con botón de regreso */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Regresar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>
          {isEdit ? 'Editar Transacción' : 'Agregar Nueva Transacción'}
        </Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tipo de Transacción*</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.tipo}
              onValueChange={(value) => setForm(prev => ({ ...prev, tipo: value }))}
              style={styles.picker}
              dropdownIconColor={colors.primary}
            >
              <Picker.Item label="Ingreso" value="ingreso" />
              <Picker.Item label="Egreso" value="egreso" />
            </Picker>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Monto*</Text>
          <TextInput
            style={styles.input}
            value={form.monto}
            onChangeText={(text) => setForm(prev => ({ ...prev, monto: text.replace(/[^0-9.]/g, '') }))}
            keyboardType="decimal-pad"
            placeholder="Ej: 1500.50"
            placeholderTextColor={colors.medium}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Fecha*</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
            <Text style={styles.dateText}>{form.fecha}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Descripción (opcional)</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={form.descripcion}
            onChangeText={(text) => {
              if (text.length <= 200) {
                setForm(prev => ({ ...prev, descripcion: text }));
              }
            }}
            placeholder="Descripción de la transacción"
            placeholderTextColor={colors.medium}
            multiline
            numberOfLines={3}
            maxLength={200}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Categoría*</Text>
          <View style={styles.pickerContainer}>
            {loadingCategorias ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Picker
                selectedValue={form.categoria_id}
                onValueChange={(value) => setForm(prev => ({ ...prev, categoria_id: value }))}
                style={styles.picker}
                dropdownIconColor={colors.primary}
              >
                <Picker.Item label="Seleccione una categoría..." value={null} color={colors.medium} />
                {categorias.map((categoria) => (
                  <Picker.Item
                    key={`cat-${categoria.id}`}
                    label={categoria.nombre}
                    value={categoria.nombre}
                  />
                ))}
              </Picker>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, !isFormValid() && styles.buttonDisabled]}
          onPress={validateAndSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>
              {isEdit ? 'ACTUALIZAR TRANSACCIÓN' : 'GUARDAR TRANSACCIÓN'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.dark,
  },
  header: {
    marginBottom: 20,
    paddingTop: 10,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.light,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 30,
    color: colors.dark,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: colors.dark,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.light,
    color: colors.dark,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.light,
  },
  picker: {
    height: 50,
    color: colors.dark,
  },
  dateInput: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.light,
  },
  dateText: {
    fontSize: 16,
    color: colors.dark,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonDisabled: {
    backgroundColor: colors.medium,
    opacity: 0.7,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});