# 🔒 Guía de Seguridad para GitHub

## ⚠️ Archivos que NO deben subirse a Git

Los siguientes archivos contienen información sensible y **NUNCA** deben incluirse en el repositorio:

### 🔑 Credenciales de Firebase

- `service-account-key.json` (json-to-firestore)
- `service-account.json` (webhook)
- `google-services.json` (app Android)

### 🤖 Credenciales de Dialogflow

- `dialogflow-key.json`

### 🌍 Variables de entorno

- `.env`

### 🏗️ Archivos de configuración locales

- `local.properties` (Android)

### 📦 Dependencias y builds

- `node_modules/`
- `.gradle/`
- `build/`

## ✅ Verificación antes de subir

### 1. Ejecutar script de limpieza

```bash
# En Linux/Mac
./clean-sensitive-files.sh

# En Windows PowerShell
.\clean-sensitive-files.ps1
```

### 2. Verificar .gitignore

Asegúrate de que estos patrones estén en tu `.gitignore`:

```gitignore
# Archivos sensibles
**/*service-account*.json
**/dialogflow-key.json
**/.env
**/google-services.json
**/local.properties
```

### 3. Verificar estado de Git

```bash
git status
```

Si ves algún archivo sensible listado, añádelo al .gitignore:

```bash
echo "archivo-sensible.json" >> .gitignore
```

### 4. Verificar historial

Si ya subiste un archivo sensible por error:

```bash
# Eliminar archivo del historial (CUIDADO: reescribe historial)
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch archivo-sensible.json' \
--prune-empty --tag-name-filter cat -- --all
```

## 📝 Configuración para colaboradores

### Archivo de configuración .env.example

Crea siempre archivos `.example` para plantillas:

```bash
cp .env .env.example
# Edita .env.example y reemplaza valores reales con placeholders
```

### Documentación clara

En el README incluye:

- Lista de archivos necesarios
- Instrucciones de configuración
- Pasos para obtener credenciales

## 🚨 Qué hacer si subes algo sensible por error

### 1. Si NO has hecho push

```bash
git reset --soft HEAD~1  # Deshace el último commit
# Añade el archivo al .gitignore
# Vuelve a hacer commit
```

### 2. Si YA hiciste push

```bash
# Elimina el archivo del repositorio
git rm --cached archivo-sensible.json
echo "archivo-sensible.json" >> .gitignore
git add .gitignore
git commit -m "Remove sensitive file and update .gitignore"
git push
```

### 3. Regenerar credenciales

- **SIEMPRE** regenera las credenciales expuestas
- Revoca las claves comprometidas en Firebase/Google Cloud
- Genera nuevas credenciales

## 🔧 Herramientas útiles

### git-secrets

Previene commits de secretos:

```bash
# Instalar
git clone https://github.com/awslabs/git-secrets.git
cd git-secrets
make install

# Configurar
git secrets --install
git secrets --register-aws
```

### pre-commit hooks

Añade validaciones antes de commit:

```bash
# Instalar pre-commit
pip install pre-commit

# Crear .pre-commit-config.yaml con reglas
# Instalar hooks
pre-commit install
```

## 📋 Checklist final

Antes de subir tu código a GitHub:

- [ ] Ejecuté script de limpieza
- [ ] Verifiqué .gitignore
- [ ] No veo archivos sensibles en `git status`
- [ ] Creé archivos .example para configuraciones
- [ ] Actualicé README con instrucciones de seguridad
- [ ] Documenté qué credenciales necesita el proyecto
- [ ] Revisé que no haya URLs locales hardcodeadas
- [ ] Eliminé comentarios con información sensible

## 🆘 Contacto de emergencia

Si accidentalmente expones credenciales:

1. Revoca inmediatamente las credenciales en Firebase Console
2. Regenera nuevas credenciales
3. Actualiza tu aplicación con las nuevas credenciales
4. Limpia el historial de Git si es necesario
