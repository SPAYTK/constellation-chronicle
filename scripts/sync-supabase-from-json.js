// Sincroniza nodos, edges y preguntas socráticas desde archivos JSON locales a Supabase
// Uso: node scripts/sync-supabase-from-json.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function syncTable(table, jsonPath, mapFn) {
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  for (const item of data) {
    const { error } = await supabase.from(table).upsert(mapFn(item), { onConflict: 'id' });
    if (error) {
      console.error(`Error upserting into ${table}:`, error.message);
    } else {
      console.log(`Upserted into ${table}:`, item.id || item.from);
    }
  }
}

(async () => {
  // Nodos
  await syncTable('lagrange_nodes', path.join(__dirname, '../src/data/nodes.json'), (n) => ({
    id: n.id,
    eje: n.axis,
    titulo: n.label,
    episodio: 0,
    angulo: '',
    palabras_clave: [],
    url: null,
    position_x: null,
    position_y: null,
  }));

  // Edges
  await syncTable('lagrange_connections', path.join(__dirname, '../src/data/edges.json'), (e, i) => ({
    id: `${e.from}_${e.to}`,
    from_node: e.from,
    to_node: e.to,
    tipo: e.type || 'relacion',
  }));

  // Preguntas socráticas
  await syncTable('socratic_questions', path.join(__dirname, '../src/data/socratic_questions.json'), (q) => ({
    id: q.id,
    question: q.question,
    axis: q.axis,
  }));

  console.log('Sincronización completa.');
})();
