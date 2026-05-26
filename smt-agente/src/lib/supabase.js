import { createClient } from '@supabase/supabase-js';

const url = process.env.REACT_APP_SUPABASE_URL;
const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.warn('Supabase não configurado. Verifique o arquivo .env.local');
}

export const supabase = createClient(url || '', key || '');
