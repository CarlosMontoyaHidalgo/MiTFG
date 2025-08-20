# Weight Tracker TFT - Proyecto Completo

Este proyecto contiene una aplicación completa de seguimiento de peso y generación de rutinas de ejercicio, compuesta por tres componentes principales:

## 🏗️ Estructura del Proyecto

### 1. WeightTrackerTFT/

**Aplicación Android** desarrollada en Kotlin con arquitectura MVVM.

**Características:**

- Seguimiento de peso corporal
- Generación de rutinas de ejercicio
- Integración con chatbot para rutinas personalizadas
- Base de datos Firebase Firestore

**Tecnologías:**

- Kotlin
- Android Jetpack Compose
- Firebase (Firestore, Authentication)
- Hilt (Inyección de dependencias)
- MVVM Architecture

### 2. Webhook/

**Servidor Node.js** que actúa como webhook para procesamiento de lenguaje natural.

**Características:**

- Procesamiento de mensajes con Dialogflow
- Generación automática de rutinas de ejercicio
- Integración con Firebase Firestore
- API REST para comunicación con la app Android

**Tecnologías:**

- Node.js
- Express.js
- Firebase Admin SDK
- Google Dialogflow
- Firebase Cloud Functions

### 3. json-to-firestore/

**Scripts de carga de datos** para poblar la base de datos Firestore.

**Características:**

- Carga masiva de ejercicios, músculos y equipamiento
- Manejo de referencias entre colecciones
- Operaciones por lotes para eficiencia

**Tecnologías:**

- Node.js
- Firebase Admin SDK

## 🚀 Configuración Inicial

### Prerrequisitos

- Node.js v14 o superior
- Android Studio
- Cuenta de Firebase
- Cuenta de Google Cloud (para Dialogflow)

### 1. Configuración de Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Activa Firestore Database
3. Descarga las credenciales de servicio:
   - Ve a Configuración del proyecto > Cuentas de servicio
   - Genera una nueva clave privada
   - Guarda el archivo como `service-account-key.json` (para scripts) y `service-account.json` (para webhook)

### 2. Configuración de Dialogflow

1. Crea un proyecto en [Google Cloud Console](https://console.cloud.google.com/)
2. Activa la API de Dialogflow
3. Crea un agente de Dialogflow
4. Descarga las credenciales como `dialogflow-key.json`

### 3. Configuración del Proyecto Android

1. Abre `WeightTrackerTFT/` en Android Studio
2. Descarga `google-services.json` desde Firebase Console
3. Coloca el archivo en `app/`
4. Sincroniza el proyecto

### 4. Configuración del Webhook

```bash
cd Webhook/workoutbot-webhook/functions
npm install
cp .env.example .env
# Edita .env con tus valores reales
cp service-account.json.example service-account.json
# Reemplaza con tu archivo real de Firebase
cp dialogflow-key.json.example dialogflow-key.json
# Reemplaza con tu archivo real de Dialogflow
```

### 5. Carga de Datos Inicial

```bash
cd json-to-firestore/json-to-firestore
npm install
cp service-account-key.json.example service-account-key.json
# Reemplaza con tu archivo real de Firebase

# Ejecuta en orden:
node upload3.js  # Músculos
node upload2.js  # Ejercicios
node upload.js   # Equipamiento
```

## 🏃‍♂️ Ejecución

### 1. Iniciar el Webhook

```bash
cd Webhook/workoutbot-webhook/functions
npm start
```

### 2. Ejecutar la App Android

1. Abre Android Studio
2. Ejecuta la aplicación en emulador o dispositivo

## 📁 Archivos de Configuración

Los siguientes archivos contienen información sensible y NO deben subirse a Git:

- `**/service-account*.json` - Credenciales de Firebase
- `**/dialogflow-key.json` - Credenciales de Dialogflow
- `**/.env` - Variables de entorno
- `**/google-services.json` - Configuración de Firebase para Android

Se han proporcionado archivos `.example` como plantillas para cada configuración.

## 🔧 Scripts Disponibles

### Webhook

- `npm start` - Inicia el servidor webhook
- `npm test` - Ejecuta pruebas (si están configuradas)

### Carga de Datos

- `node upload.js` - Carga equipamiento
- `node upload2.js` - Carga ejercicios
- `node upload3.js` - Carga músculos
- `node routines_predefined.js` - Carga rutinas predefinidas

## 🐛 Solución de Problemas

### Error de autenticación Firebase

- Verifica que los archivos de credenciales sean válidos
- Asegúrate de que las rutas en las variables de entorno sean correctas

### La app Android no conecta con el webhook

- Verifica que el webhook esté ejecutándose en `localhost:3000`
- Para dispositivo físico, cambia la IP en `ChatbotApiServiceImpl.kt`

### Error de referencias en Firestore

- Asegúrate de cargar los datos en orden: músculos → ejercicios → equipamiento

## 📝 Contribución

1. Fork el proyecto
2. Crea una rama para tu funcionalidad (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Autores

- **Tu Nombre** - _Trabajo inicial_ - [TuGitHub](https://github.com/tuusuario)

## 🙏 Agradecimientos

- Firebase por el backend
- Google Dialogflow por el procesamiento de lenguaje natural
- Material Design para la UI
