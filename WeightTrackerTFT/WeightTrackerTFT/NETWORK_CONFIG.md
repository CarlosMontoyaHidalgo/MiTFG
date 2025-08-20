# 🌐 Configuración de Red - Android App

## 📡 Configuración del Webhook URL

La aplicación Android necesita comunicarse con el servidor webhook. La URL depende de cómo ejecutes la aplicación:

### 🔧 Configuración en `ChatbotConfig.kt`

Edita el archivo `app/src/main/java/com/aronid/weighttrackertft/data/remote/chatbot/ChatbotConfig.kt`:

```kotlin
object ChatbotConfig {
    // Cambia esta URL según tu configuración
    const val BASE_URL = "TU_URL_AQUI"
    // ...
}
```

### 📱 Para Emulador Android

```kotlin
const val BASE_URL = "http://10.0.2.2:3000"
```

- `10.0.2.2` es la IP especial del emulador que apunta a `localhost` de tu PC
- El webhook debe estar ejecutándose en `localhost:3000`

### 📱 Para Dispositivo Físico (misma red WiFi)

1. Encuentra la IP de tu PC:

   ```bash
   # Windows
   ipconfig

   # Linux/Mac
   ifconfig
   ```

2. Configura la URL:
   ```kotlin
   const val BASE_URL = "http://192.168.1.XXX:3000"
   ```
   Reemplaza `192.168.1.XXX` con la IP real de tu PC.

### 🌐 Para Producción

```kotlin
const val BASE_URL = "https://tu-servidor.com"
```

## 🔍 Verificación de conectividad

### 1. Verificar que el webhook está ejecutándose

```bash
cd Webhook/workoutbot-webhook/functions
npm start
```

Debería mostrar: `Servidor ejecutándose en puerto 3000`

### 2. Probar desde el navegador

- Emulador: [http://localhost:3000](http://localhost:3000)
- Dispositivo físico: `http://TU_IP:3000`

### 3. Probar la API

```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "language": "es"}'
```

## 🚨 Solución de problemas

### Error "Network Security Configuration"

Si la app no puede conectar por HTTP, añade a `app/src/main/AndroidManifest.xml`:

```xml
<application
    android:networkSecurityConfig="@xml/network_security_config"
    ... >
```

Y crea `app/src/main/res/xml/network_security_config.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">10.0.2.2</domain>
        <domain includeSubdomains="true">192.168.1.0/24</domain>
        <domain includeSubdomains="true">localhost</domain>
    </domain-config>
</network-security-config>
```

### Error "Connection refused"

- Verifica que el webhook esté ejecutándose
- Verifica la IP/URL en `ChatbotConfig.kt`
- Para dispositivo físico, asegúrate de estar en la misma red WiFi

### Error "Timeout"

- Verifica la conectividad de red
- Aumenta los timeouts en `ChatbotConfig.kt`:
  ```kotlin
  const val CONNECT_TIMEOUT_SECONDS = 60L
  const val READ_TIMEOUT_SECONDS = 60L
  ```

## 📋 Checklist de configuración

- [ ] Webhook ejecutándose en puerto 3000
- [ ] URL correcta en `ChatbotConfig.kt`
- [ ] Para dispositivo físico: IP de PC configurada
- [ ] Para dispositivo físico: misma red WiFi
- [ ] Configuración de seguridad de red (si es necesario)
- [ ] Permisos de internet en AndroidManifest.xml
