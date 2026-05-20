import { createClient } from "@supabase/supabase-js";
import { requireEnv } from "@/lib/env";

export function createServiceClient() {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!key) {
    throw new Error("Variável de ambiente ausente: SUPABASE_SERVICE_ROLE_KEY ou NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  }

  return createClient(requireEnv("NEXT_PUBLIC_SUPABASE_URL"), key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
