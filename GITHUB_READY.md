# 📋 Instrucciones para subir a GitHub

## ✅ Pasos completados:

- [x] Creado `.gitignore` principal que excluye archivos sensibles
- [x] Actualizados `.gitignore` existentes en cada subcarpeta
- [x] Creados archivos `.example` para todas las configuraciones sensibles
- [x] Creado script de limpieza (`clean-sensitive-files.ps1`)
- [x] Creado script de inicialización (`setup.ps1`)
- [x] Documentación de seguridad (`SECURITY.md`)
- [x] Configuración de red para Android (`NETWORK_CONFIG.md`)
- [x] README principal del proyecto
- [x] Licencia MIT
- [x] Configuración centralizada para URLs en Android

## 🚀 Para subir a GitHub:

### 1. Ejecutar limpieza

```powershell
.\clean-sensitive-files.ps1
```

### 2. Inicializar repositorio Git

```bash
git init
git add .
git commit -m "Initial commit: Weight Tracker TFT project"
```

### 3. Crear repositorio en GitHub

1. Ve a [GitHub](https://github.com) y crea un nuevo repositorio
2. NO inicialices con README (ya tienes uno)
3. Copia la URL del repositorio

### 4. Conectar y subir

```bash
git remote add origin https://github.com/tuusuario/tu-repositorio.git
git branch -M main
git push -u origin main
```

## 📝 Para nuevos colaboradores:

### 1. Clonar repositorio

```bash
git clone https://github.com/tuusuario/tu-repositorio.git
cd tu-repositorio
```

### 2. Ejecutar script de inicialización

```powershell
.\setup.ps1
```

### 3. Configurar credenciales

1. Descargar credenciales de Firebase
2. Configurar Dialogflow
3. Editar archivos `.env` y configuraciones

## 🔒 Archivos excluidos de Git:

- `service-account-key.json` (Firebase credentials)
- `service-account.json` (Firebase credentials)
- `dialogflow-key.json` (Dialogflow credentials)
- `google-services.json` (Android Firebase config)
- `.env` (Environment variables)
- `local.properties` (Android local config)
- `node_modules/` (Dependencies)
- Build folders and logs

## ⚠️ Importante:

- ✅ Los archivos sensibles están en `.gitignore`
- ✅ Se han creado plantillas `.example` para todo
- ✅ La documentación incluye instrucciones de seguridad
- ✅ El proyecto está listo para colaboración

## 🎉 ¡Tu proyecto está listo para GitHub!

El proyecto ahora es seguro para subir a un repositorio público. Todos los archivos sensibles están protegidos y hay documentación clara para nuevos desarrolladores.
