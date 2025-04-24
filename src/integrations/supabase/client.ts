
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kdlluwzqcgrbyjhjjqyh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkbGx1d3pxY2dyYnlqaGpqcXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MjI4NDksImV4cCI6MjA2MTA5ODg0OX0.LYIonMM3Q1ks5wRytTk1G0IxJ3esicb2eIZK3wlBgMQ";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);
