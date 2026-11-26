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

### 2. Sync variables from GitHub

```bash
# For development environment
ENV_TYPE=development node scripts/sync-env-from-github.js

# For production environment
ENV_TYPE=production node scripts/sync-env-from-github.js
```

This generates `backend/.env.local` with public variables.

### 3. Add MONGO_URI manually

The script cannot retrieve MONGO_URI (it's an encrypted Secret in GitHub).

Edit `backend/.env.local` and add:

```bash
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

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
