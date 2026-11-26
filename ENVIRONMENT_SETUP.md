# Environment Setup

Este proyecto usa GitHub para centralizar secretos y variables de entorno.

## 🔐 Variables en GitHub

### Environment Variables (públicas)
- `MONGO_DB_NAME` → Base de datos a usar
- `CORS_ORIGIN` → URL del frontend

### Environment Secrets (encriptados)
- `MONGO_URI` → Connection string de MongoDB

## 📋 Setup Inicial

### 1. Crear GitHub Personal Access Token

```bash
# Ve a https://github.com/settings/tokens/new
# Permisos necesarios: read:env (leer variables de entorno)
# Copia el token
```

### 2. Configurar GITHUB_TOKEN en tu máquina

```bash
# Opción A: Variable temporal (solo esta sesión)
export GITHUB_TOKEN=tu_token_aqui

# Opción B: Permanente en ~/.bashrc o ~/.zshrc
echo 'export GITHUB_TOKEN=tu_token_aqui' >> ~/.bashrc
source ~/.bashrc
```

### 3. Sincronizar variables desde GitHub

```bash
# Para ambiente development
ENV_TYPE=development node scripts/sync-env-from-github.js

# Para ambiente production
ENV_TYPE=production node scripts/sync-env-from-github.js
```

Esto genera `backend/.env.local` con las variables.

### 4. Agregar MONGO_URI manualmente

El script NO obtiene MONGO_URI (es un Secret encriptado en GitHub).

Edita `backend/.env.local` y agrega:

```bash
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/
```

## 🚀 Flujo de trabajo

### Desarrollo (rama dev)

```bash
# 1. Sincronizar variables de development
ENV_TYPE=development node scripts/sync-env-from-github.js

# 2. Editar backend/.env.local y agregar MONGO_URI

# 3. Iniciar servidor
cd backend && npm run dev
```

### Producción (rama main)

Variables se obtienen automáticamente desde GitHub/Vercel en el deployment.

## ⚠️ Notas de Seguridad

- **Nunca** commitees `.env.local`
- **Nunca** compartas tu `GITHUB_TOKEN` públicamente
- Los Secrets de GitHub no se pueden leer directamente (es una limitación de seguridad)
- Para cambiar secretos, usa GitHub UI o API con permisos adicionales
