#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = 'adrianaabad/my-old-grimoire';
const ENVIRONMENT = process.env.ENV_TYPE || 'development'; // development o production

if (!GITHUB_TOKEN) {
  console.error('❌ Error: GITHUB_TOKEN no está configurado');
  console.error('   Ejecuta: export GITHUB_TOKEN=tu_token');
  process.exit(1);
}

function fetchFromGitHub(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${REPO}${path}`,
      method: 'GET',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'Node.js env-sync',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`GitHub API error: ${res.statusCode} - ${data}`));
        } else {
          resolve(JSON.parse(data));
        }
      });
    }).on('error', reject);
  });
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
