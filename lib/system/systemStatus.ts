import { getRepositoryModeInfo } from "@/lib/repositories/SettingsRepository";
import { hasSupabaseServiceRoleEnv } from "@/lib/supabase/admin";
import { getAppUrl, hasSupabaseConfig } from "@/lib/supabase/config";

export type SystemServiceStatus = "Configured" | "Missing";

function toStatus(value: boolean): SystemServiceStatus {
  return value ? "Configured" : "Missing";
}

function hasAnalyticsEnv() {
  return Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim());
}

export function getSystemStatus() {
  const repositoryMode = getRepositoryModeInfo().mode;
  const appUrl = getAppUrl();

  return {
    supabaseAuth: toStatus(hasSupabaseConfig()),
    supabaseServiceRole: toStatus(hasSupabaseServiceRoleEnv()),
    resend: toStatus(Boolean(process.env.RESEND_API_KEY?.trim())),
    openai: toStatus(Boolean(process.env.OPENAI_API_KEY?.trim())),
    analytics: toStatus(hasAnalyticsEnv()),
    repositoryMode,
    appUrl: appUrl || "Missing",
  };
}
