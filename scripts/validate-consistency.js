// scripts/validate-consistency.js
// Valida consistencia entre nodos, ejes, episodios y preguntas antes de build/deploy
// Uso: node scripts/validate-consistency.js

const fs = require('fs');
const path = require('path');

function readJSON(file) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf8'));
}

function error(msg) {
  console.error('❌', msg);
  process.exitCode = 1;
}

// Cargar datos
const nodes = readJSON('../src/data/nodes.json');
const edges = readJSON('../src/data/edges.json');
const episodes = readJSON('../src/data/episodes.json');
const axes = readJSON('../src/data/lagrange_map.json');
const questions = readJSON('../src/data/socratic_questions.json');

// Validar que todos los nodos tengan eje válido
debug('Validando ejes de nodos...');
const axisIds = new Set(axes.map(a => a.id));
for (const n of nodes) {
  if (!axisIds.has(n.axis)) {
    error(`Nodo ${n.id} tiene eje inválido: ${n.axis}`);
  }
}

// Validar que todos los edges apunten a nodos existentes
debug('Validando edges...');
const nodeIds = new Set(nodes.map(n => n.id));
for (const e of edges) {
  if (!nodeIds.has(e.from)) error(`Edge from inválido: ${e.from}`);
  if (!nodeIds.has(e.to)) error(`Edge to inválido: ${e.to}`);
}

// Validar que todos los episodios tengan título y eje
for (const ep of episodes) {
  if (!ep.title || !ep.axis) error(`Episodio ${ep.id} sin título o eje`);
}

// Validar que todas las preguntas tengan eje válido
for (const q of questions) {
  if (!axisIds.has(q.axis)) error(`Pregunta ${q.id} con eje inválido: ${q.axis}`);
}

console.log('✅ Validación de consistencia completada.');

function debug(msg) {
  if (process.env.DEBUG) console.log(msg);
}
