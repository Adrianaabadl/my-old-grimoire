#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO = 'adrianaabad/my-old-grimoire';
const ENVIRONMENT = process.env.ENV_TYPE || 'development'; // development o production

function fetchFromGitHub(endpoint) {
  try {
    const result = execSync(`gh api repos/${REPO}${endpoint}`, {
      encoding: 'utf-8'
    });
    return JSON.parse(result);
  } catch (error) {
    throw new Error(`GitHub API error: ${error.message}`);
  }
}

async function syncEnv() {
  try {
    console.log(`📥 Obteniendo variables de GitHub para ambiente: ${ENVIRONMENT}`);

    const variables = await fetchFromGitHub(`/environments/${ENVIRONMENT}/variables`);

    let envContent = `# Sincronizado desde GitHub - ${new Date().toISOString()}\n`;
    envContent += `# Ambiente: ${ENVIRONMENT}\n\n`;

    variables.variables.forEach(v => {
      envContent += `${v.name}=${v.value}\n`;
    });

    envContent += `\n# ⚠️  IMPORTANTE: Agrega MONGO_URI manualmente en .env.local (no está en GitHub por seguridad)\n`;
    envContent += `# MONGO_URI=tu-connection-string-aqui\n`;

    const envPath = path.join(__dirname, '../backend/.env.local');
    fs.writeFileSync(envPath, envContent);

    console.log(`✅ Variables sincronizadas en: ${envPath}`);
    console.log('\n📋 Variables obtenidas:');
    variables.variables.forEach(v => {
      console.log(`   - ${v.name}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

syncEnv();
