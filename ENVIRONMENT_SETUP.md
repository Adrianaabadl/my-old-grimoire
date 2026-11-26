# Environment Setup

This project uses GitHub to centralize secrets and environment variables.

## 🔐 Variables in GitHub

### Environment Variables (public)
- `MONGO_DB_NAME` → Database to use
- `CORS_ORIGIN` → Frontend URL

### Environment Secrets (encrypted)
- `MONGO_URI` → MongoDB connection string
- `JWT_SECRET` → JWT signing key (stored at repository level)

## 📋 Initial Setup

### 1. Authenticate with GitHub CLI

```bash
gh auth login
# Follow the prompts to authenticate
# GitHub CLI will securely store your credentials
```

### 2. Load environment variables for development

The script fetches variables from GitHub and exports them to your shell (no files created).

**For Backend (Terminal 1):**
```bash
eval $(ENV_TYPE=development node scripts/sync-env-from-github.js) && \
export MONGO_URI="your-connection-string" && \
cd backend && npm run dev
```

**For Frontend (Terminal 2):**
```bash
eval $(ENV_TYPE=development node scripts/sync-env-from-github.js) && npm start
```

**What this does:**
- Fetches public variables from GitHub (CORS_ORIGIN, MONGO_DB_NAME)
- Injects them into the current shell session
- Runs the app with those variables in memory
- **Nothing is persisted to files**

## 🚀 Workflow

### Development (dev branch)

```bash
# 1. Sync development variables
ENV_TYPE=development node scripts/sync-env-from-github.js

# 2. Edit backend/.env.local and add MONGO_URI

# 3. Start the server
cd backend && npm run dev
```

### Production (main branch)

Variables are automatically retrieved from GitHub/Vercel during deployment.

## ⚠️ Security Notes

- **Never** commit `.env.local` to git (already in .gitignore)
- **Never** share your GitHub credentials publicly
- GitHub Secrets cannot be read directly from outside GitHub Actions (security limitation)
- Use `gh auth login` for secure, automatic authentication
- JWT_SECRET must be the same across all environments for token verification
