#  LanaApp

**LanaApp** es una aplicación móvil de finanzas personales construida con **Reac
t Native**. Permite a los usuarios gestionar ingresos, egresos, presupuestos y v
isualizar sus finanzas de forma clara, profesional y sencilla.

---

##  Instalación del proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/lanaapp.git
cd lanaapp
```

### 2. Dependencias React Native
```bash
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
npm install axios
npm install @react-native-async-storage/async-storage

```
### 3. Dependencias Navigation
```bash
npm install @react-navigation/native
npm install react-native-screens react-native-safe-area-context
npm install @react-navigation/native-stack
```

## Configuración de la API

1. Define la URL base de tu servicio REST en una variable de entorno llamada `EX
PO_PUBLIC_API_URL` al ejecutar la aplicación o en un archivo `.env`.
2. De forma predeterminada la aplicación usará `http://localhost:3000/api` si no
 se especifica otra dirección.

Esta configuración será utilizada por los servicios ubicados en `src/services/`
para realizar las peticiones a la API.
