// Sincroniza episodios entre fuentes de datos y el frontend
// Ejecutar con: node scripts/sync-episodes.cjs

const fs = require('fs');
const path = require('path');

const srcEpisodes = path.join(__dirname, '../src/data/episodes.ts');
const destEpisodes = path.join(__dirname, '../src/data/podcast/episodes.json');

// TODO: Implementar lógica de sincronización real
console.log('Sincronización de episodios no implementada (placeholder)');
