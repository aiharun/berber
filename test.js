require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
supabase.from('barbers').select('*').then(res => {
  console.log('Barbers:', res.data);
}).catch(err => {
  console.error(err);
});
