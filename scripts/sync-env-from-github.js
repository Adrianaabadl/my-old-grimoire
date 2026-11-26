#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO = 'adrianaabad/my-old-grimoire';
const ENVIRONMENT = process.env.ENV_TYPE || 'development'; // development or production

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
    console.log(`📥 Fetching environment variables from GitHub: ${ENVIRONMENT}`);

    const variables = await fetchFromGitHub(`/environments/${ENVIRONMENT}/variables`);

    let envContent = `# Synced from GitHub - ${new Date().toISOString()}\n`;
    envContent += `# Environment: ${ENVIRONMENT}\n\n`;

    variables.variables.forEach(v => {
      envContent += `${v.name}=${v.value}\n`;
    });

    envContent += `\n# ⚠️  IMPORTANT: Add MONGO_URI manually in .env.local (not in GitHub for security)\n`;
    envContent += `# MONGO_URI=your-connection-string-here\n`;

    const envPath = path.join(__dirname, '../backend/.env.local');
    fs.writeFileSync(envPath, envContent);

    console.log(`✅ Variables synced to: ${envPath}`);
    console.log('\n📋 Variables obtained:');
    variables.variables.forEach(v => {
      console.log(`   - ${v.name}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

syncEnv();
