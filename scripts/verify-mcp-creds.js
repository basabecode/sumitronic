const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pmvhtxlciekynczjspja.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtdmh0eGxjaWVreW5jempzcGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzg1MTgsImV4cCI6MjA3MTcxNDUxOH0.ozJTD7sdEcjZo-bkPRoMkLWChzyHfBHQf5Flqz_yHEo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  try {
    const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });

    if (error) {
      // If table doesn't exist, it might still be a valid connection but empty DB
      if (error.code === '42P01') { // undefined_table
         console.log('✅ Connection successful! (Database connected, but "products" table not found yet)');
         return;
      }
      throw error;
    }

    console.log('✅ Connection successful! Supabase is reachable.');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  }
}

testConnection();
