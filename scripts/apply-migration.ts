// Quick script to apply migration through Supabase client
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  const migrationPath = path.join(__dirname, '../supabase/migrations/021_create_assistance_items_table.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');

  console.log('📤 Applying migration...');
  
  // Note: This requires service role key for raw SQL execution
  // For now, copy the SQL and run it in Supabase SQL Editor
  console.log('\n⚠️  Copy this SQL and run it in Supabase SQL Editor:\n');
  console.log('https://supabase.com/dashboard/project/zwcpoqeimpabivktyagy/sql/new');
  console.log('\n' + sql);
}

applyMigration();
