#!/usr/bin/env node

/**
 * Deploy Supabase migrations using Supabase JS client
 * Usage: node deploy-migrations.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration from environment
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://cadavbabblukuabioekc.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_KEY in environment');
  console.error('   Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const MIGRATIONS_DIR = path.join(__dirname, 'supabase', 'migrations');

/**
 * Execute SQL via Supabase REST API
 */
async function executeSql(sql) {
  try {
    // Use the RPC method to execute SQL
    // Note: This requires a database function to be created
    // For now, we'll use a workaround with the raw API
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/execute_sql`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql_text: sql }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`   ❌ Error: ${error}`);
      return false;
    }

    console.log(`   ✅ Success`);
    return true;
  } catch (error) {
    console.error(`   ❌ Exception: ${error.message}`);
    return false;
  }
}

/**
 * Main deployment logic
 */
async function deploy() {
  console.log('🚀 Deploying Supabase migrations...\n');

  // List migrations
  const migrations = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();

  if (migrations.length === 0) {
    console.error('❌ No migrations found');
    return false;
  }

  console.log(`📁 Found ${migrations.length} migrations:`);
  migrations.forEach(m => console.log(`   - ${m}`));
  console.log();

  // Execute each migration
  let allSuccess = true;
  for (const migration of migrations) {
    const filePath = path.join(MIGRATIONS_DIR, migration);
    console.log(`📄 Executing ${migration}...`);

    try {
      const sql = fs.readFileSync(filePath, 'utf8');
      const success = await executeSql(sql);
      if (!success) {
        allSuccess = false;
      }
    } catch (error) {
      console.error(`   ❌ Failed to read file: ${error.message}`);
      allSuccess = false;
    }
  }

  console.log();
  if (allSuccess) {
    console.log('✅ All migrations deployed successfully!');
    console.log('\n📋 Verify in Dashboard:');
    console.log('   1. Go to https://app.supabase.com');
    console.log('   2. Select project: cadavbabblukuabioekc');
    console.log('   3. Click "Table Editor"');
    console.log('   4. Check that episodes, axes, questions exist');
  } else {
    console.log('⚠️  Some migrations failed');
  }

  return allSuccess;
}

// Run deployment
deploy()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
