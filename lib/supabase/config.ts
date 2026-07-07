export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL?.trim() ?? "";
}

export function getSupabaseConfig(): SupabaseConfig {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  };
}

export function hasSupabaseConfig(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey);
}

export function requireSupabaseConfig(): SupabaseConfig {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) {
    throw new Error("Supabase environment variables are missing.");
  }
  return config;
}

export function requireAppUrl(): string {
  const appUrl = getAppUrl();
  if (!appUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is required.");
  }
  return appUrl;
}
