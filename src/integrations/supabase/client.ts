
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Extend the Database type with our projects table
interface ExtendedDatabase extends Database {
  public: {
    Tables: Database['public']['Tables'];
    Views: Database['public']['Views'];
    Functions: Database['public']['Functions'];
    Enums: Database['public']['Enums'];
    CompositeTypes: Database['public']['CompositeTypes'];
  }
}

const SUPABASE_URL = "https://mrvcqyqvldopdvbnfanz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ydmNxeXF2bGRvcGR2Ym5mYW56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MzEzMDAsImV4cCI6MjA2MTEwNzMwMH0.jf8WQ5O56hi8-5r8Bj1KePz8OJQmD-Ayyoue_jiSxiM";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
