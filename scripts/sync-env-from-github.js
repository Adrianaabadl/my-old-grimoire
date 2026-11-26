#!/usr/bin/env node

const { execSync } = require('child_process');

const REPO = 'Adrianaabadl/my-old-grimoire';
const ENVIRONMENT = process.env.ENV_TYPE || 'development';

function fetchFromGitHub(endpoint) {
  try {
    const result = execSync(`gh api repos/${REPO}${endpoint}`, {
      encoding: 'utf-8',
    });
    return JSON.parse(result);
  } catch (error) {
    throw new Error(`GitHub API error: ${error.message}`);
  }
}

async function syncEnv() {
  try {
    const variables = fetchFromGitHub(`/environments/${ENVIRONMENT}/variables`);

    // Export variables to shell
    variables.variables.forEach((v) => {
      console.log(`export ${v.name}="${v.value}"`);
    });

    // Instructions for MONGO_URI
    console.log('# Add MONGO_URI manually:');
    console.log('# export MONGO_URI="your-connection-string"');
  } catch (error) {
    console.error(`❌ Error: ${error.message}`, { fd: 2 });
    process.exit(1);
  }
}

syncEnv();
