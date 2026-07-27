require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testAuth() {
  console.log("Testing staff auth...");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: process.env.VITE_STAFF_EMAIL,
    password: process.env.VITE_STAFF_PASSWORD
  });
  
  if (error) {
    console.error("Auth failed:", error.message);
  } else {
    console.log("Auth success!");
  }
}

testAuth();
