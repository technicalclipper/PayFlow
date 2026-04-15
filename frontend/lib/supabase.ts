import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Server-side client — same key since RLS policies allow all operations.
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseKey,
  { auth: { persistSession: false } }
);
