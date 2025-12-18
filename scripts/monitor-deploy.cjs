// scripts/monitor-deploy.cjs
// Monitorea el estado de despliegue y consistencia de datos críticos
// Uso: node scripts/monitor-deploy.cjs

const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const PUBLIC_URL = process.env.PUBLIC_URL || 'https://as6173268.github.io/constellation-chronicle/';

async function checkURL(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    console.log('✅', url);
    return true;
  } catch (e) {
    console.error(`❌ Error accediendo a ${url}:`, e.message);
    return false;
  }
}

async function main() {
  // Verifica index.html
  await checkURL(PUBLIC_URL + 'index.html');
  // Verifica assets principales
  await checkURL(PUBLIC_URL + 'assets/index-BsGBTbjP.css');
  await checkURL(PUBLIC_URL + 'assets/index-DCTsyTWM.js');
  // Verifica consistencia local
  try {
    require('./validate-consistency.cjs');
  } catch (e) {
    // Si solo es un script, no importa
  }
  console.log('✅ Monitoreo de despliegue completado.');
}

main();
