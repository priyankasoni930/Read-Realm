import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ybaslarpkivmywfcdpmb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliYXNsYXJwa2l2bXl3ZmNkcG1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2OTE0NzYsImV4cCI6MjA2MjI2NzQ3Nn0.jiY6sKGBkPqMOz6sOB65IJe3tTCEjmOF4w1ZYT3BJR0';

export const supabase = createClient(supabaseUrl, supabaseKey);
