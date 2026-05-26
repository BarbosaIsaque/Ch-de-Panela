'use strict';
// Cliente Supabase com a chave service_role (ignora RLS). USO SÓ NO SERVIDOR.
const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.warn('[Supabase] Faltam SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (.env). O banco não vai funcionar.');
}

const supabase = createClient(url || '', key || '', {
  auth: { persistSession: false, autoRefreshToken: false },
});

module.exports = { supabase };
