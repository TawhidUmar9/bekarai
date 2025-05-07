import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with environment variables
const supabaseUrl = 'https://wijfskxklffrhxqmmorm.supabase.co';
const supabaseKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpamZza3hrbGZmcmh4cW1tb3JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MTgxNzAsImV4cCI6MjA2MjA5NDE3MH0.U2mCY2rkIK1wd4wrdo4hMy0lhc20xFH0fK2-qZIpwOk";
const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };

