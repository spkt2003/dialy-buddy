// TODO: RLS policies allow anonymous insert and read.
// In production: require auth for insert, restrict read to admin role only.

import { createClient } from "@supabase/supabase-js";

// NEXT_PUBLIC_ prefix is required so the client is also accessible in browser code (booth page real-time subscription).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Singleton — importing this file multiple times returns the same client instance, preventing duplicate GoTrue auth listeners.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
