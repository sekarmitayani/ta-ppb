import { createClient } from '@supabase/supabase-js';

// GANTI DENGAN DATA DARI SUPABASE -> PROJECT SETTINGS -> API
const supabaseUrl = 'https://zifuikgupraoyeezdukx.supabase.co'; // Project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZnVpa2d1cHJhb3llZXpkdWt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNDkwMTQsImV4cCI6MjA3OTgyNTAxNH0.XKx0FuLCIqB95c51LB9Tc2Gp08OwUkeFe9yBbDqpgj8'; // Project API Key (anon public)

export const supabase = createClient(supabaseUrl, supabaseKey);