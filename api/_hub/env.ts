// Server-side configuration for the Business Hub functions.
//
// Set in Vercel → Project → Settings → Environment Variables:
//   ANTHROPIC_API_KEY       the Claude API key (server only)
//   HUB_SUPABASE_URL        the Hub's Supabase project URL
//   HUB_SUPABASE_ANON_KEY   its anon (public) key
// The browser build reads the same two Supabase values as VITE_HUB_SUPABASE_URL
// and VITE_HUB_SUPABASE_ANON_KEY; the functions accept those names too, so one
// pair of variables is enough. No service-role key is used anywhere: every
// database call runs as the signed-in user, under Row Level Security.

const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};

export const hubEnv = {
  anthropicKey: env.ANTHROPIC_API_KEY ?? "",
  supabaseUrl: env.HUB_SUPABASE_URL ?? env.VITE_HUB_SUPABASE_URL ?? "",
  supabaseAnonKey: env.HUB_SUPABASE_ANON_KEY ?? env.VITE_HUB_SUPABASE_ANON_KEY ?? "",
  /** The model every Hub agent runs on. */
  model: env.HUB_MODEL ?? "claude-opus-5-5",
};
