import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { ACCOUNT_TYPE_LABELS, type AccountType } from "./registration-config";

const REMEMBER_KEY = "intellistack:remember";
const REMEMBER_EMAIL_KEY = "intellistack:remember-email";
const SESSION_ALIVE_KEY = "intellistack:session-alive";
export const POST_OAUTH_KEY = "intellistack:post-oauth";

/** Remember Me: keep the session across browser restarts and prefill the email. */
export function saveRememberPreference(remember: boolean, email?: string) {
  try {
    localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0");
    sessionStorage.setItem(SESSION_ALIVE_KEY, "1");
    if (remember && email) localStorage.setItem(REMEMBER_EMAIL_KEY, email);
    if (!remember) localStorage.removeItem(REMEMBER_EMAIL_KEY);
  } catch {
    /* storage unavailable */
  }
}

export function getRememberedEmail() {
  try {
    return localStorage.getItem(REMEMBER_EMAIL_KEY) ?? "";
  } catch {
    return "";
  }
}

/** Ends sessions that were started without Remember Me once the browser was closed. */
export async function enforceRememberPreference() {
  try {
    if (localStorage.getItem(REMEMBER_KEY) === "0" && !sessionStorage.getItem(SESSION_ALIVE_KEY)) {
      localStorage.removeItem(REMEMBER_KEY);
      await supabase.auth.signOut({ scope: "local" });
    }
  } catch {
    /* ignore */
  }
}

export function friendlyAuthError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "That email and password don't match an account.";
  if (m.includes("email not confirmed")) return "Please confirm your email address first — check your inbox for the link.";
  if (m.includes("phone") && (m.includes("provider") || m.includes("unsupported") || m.includes("disabled")))
    return "Phone verification codes aren't switched on for IntelliStack yet. Please sign in with email for now.";
  if (m.includes("signups not allowed") || m.includes("user not found"))
    return "We couldn't find an account for that phone number.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Too many attempts. Please wait a minute and try again.";
  if (m.includes("token has expired") || m.includes("invalid token") || m.includes("otp"))
    return "That code is invalid or has expired. Request a new one.";
  return message;
}

/**
 * After sign-in, make sure the account belongs to the environment the user chose.
 * This is a convenience check only — access is enforced by the backend.
 */
export async function checkEnvironmentMatch(userId: string, allowed: AccountType[]) {
  const { data } = await supabase
    .from("account_registrations")
    .select("account_type")
    .eq("user_id", userId)
    .maybeSingle();
  if (!data) return { ok: true as const };
  if (allowed.includes(data.account_type)) return { ok: true as const };
  return {
    ok: false as const,
    message: `This account is registered as ${ACCOUNT_TYPE_LABELS[data.account_type]}. Choose the matching login environment to sign in.`,
  };
}

export async function signInWithCloudProvider(provider: "google" | "microsoft" | "apple") {
  try {
    sessionStorage.setItem(POST_OAUTH_KEY, "1");
  } catch {
    /* ignore */
  }
  return lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
}
