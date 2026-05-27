import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  "https://placeholder.supabase.co";
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  "placeholder-anon-key";

const isConfigured =
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!isConfigured) {
  console.warn(
    "[Deev] Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file. Lead capture will be disabled until then."
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
export const supabaseReady = Boolean(isConfigured);
