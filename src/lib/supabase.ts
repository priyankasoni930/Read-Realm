import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wgylvmmkfhfxvrltrhhb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndneWx2bW1rZmhmeHZybHRyaGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5OTE5ODcsImV4cCI6MjA0NjU2Nzk4N30.084tWaNEbLw0QF6oQmbBh86sQBXuMnjwMQOTfHN-Dkc";

export const supabase = createClient(supabaseUrl, supabaseKey);
