import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, KeyRound, LifeBuoy, Loader2, LogIn, Mail, Phone, UserPlus, Waypoints } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import {
  checkEnvironmentMatch,
  friendlyAuthError,
  getRememberedEmail,
  saveRememberPreference,
} from "@/lib/intellistack/auth";
import type { LoginContext } from "@/lib/intellistack/environments";
import { PHONE_REGEX } from "@/lib/intellistack/registration-config";
import { cn } from "@/lib/utils";

type Method = "email" | "phone";

const emailSchema = z.string().trim().email("Enter a valid email address.").max(255);

export function normalizePhone(raw: string) {
  const digits = raw.replace(/[^\d+]/g, "");
  return digits.startsWith("+") ? digits : `+${digits}`;
}

export function LoginForm({
  context,
  onSignUp,
  onForgotPassword,
  onHelp,
  onOtherMethods,
}: {
  context: LoginContext;
  onSignUp: () => void;
  onForgotPassword: (email: string) => void;
  onHelp: () => void;
  onOtherMethods: () => void;
}) {
  const navigate = useNavigate();
  const ids = useId();
  const [method, setMethod] = useState<Method>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeSentTo, setCodeSentTo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const remembered = getRememberedEmail();
    if (remembered) setEmail(remembered);
  }, []);

  useEffect(() => {
    setError(null);
    setNotice(null);
  }, [context.heading, method]);

  async function finishSignIn(userId: string, emailForRemember?: string) {
    const match = await checkEnvironmentMatch(userId, context.accountTypes);
    if (!match.ok) {
      await supabase.auth.signOut();
      setError(match.message);
      return;
    }
    saveRememberPreference(remember, emailForRemember);
    await navigate({ to: "/account" });
  }

  async function onEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Enter a valid email address.");
    if (!password) return setError("Enter your password.");
    setBusy(true);
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email: parsed.data, password });
      if (err) return setError(friendlyAuthError(err.message));
      await finishSignIn(data.user.id, parsed.data);
    } finally {
      setBusy(false);
    }
  }

  async function onSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!PHONE_REGEX.test(phone.trim())) return setError("Enter a valid phone number, including country code.");
    const normalized = normalizePhone(phone);
    setBusy(true);
    try {
      const { error: err } = await supabase.auth.signInWithOtp({ phone: normalized, options: { shouldCreateUser: false } });
      if (err) return setError(friendlyAuthError(err.message));
      setCodeSentTo(normalized);
      setCode("");
      setNotice(`We sent a 6-digit code to ${normalized}.`);
    } finally {
      setBusy(false);
    }
  }

  async function onVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!codeSentTo) return;
    setError(null);
    if (code.length !== 6) return setError("Enter the 6-digit code.");
    setBusy(true);
    try {
      const { data, error: err } = await supabase.auth.verifyOtp({ phone: codeSentTo, token: code, type: "sms" });
      if (err || !data.user) return setError(friendlyAuthError(err?.message ?? "Verification failed."));
      await finishSignIn(data.user.id);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-lg font-bold text-foreground">{context.heading}</h3>
        <p className="text-sm text-foreground/80">{context.description}</p>
      </div>

      <div role="tablist" aria-label="Sign-in method" className="grid grid-cols-2 gap-1 rounded-lg border border-env-accent/40 bg-env-deep/70 p-1 env-transition">
        {(
          [
            { id: "email", label: "Email", Icon: Mail },
            { id: "phone", label: "Phone Number", Icon: Phone },
          ] as const
        ).map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={method === id}
            onClick={() => setMethod(id)}
            className={cn(
              "flex items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold env-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-env-accent",
              method === id ? "bg-env-strong text-foreground" : "text-env-accent hover:bg-env-base",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {method === "email" ? (
        <form onSubmit={onEmailSubmit} className="space-y-3" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor={`${ids}-email`}>Email address</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-env-accent" aria-hidden="true" />
              <Input
                id={`${ids}-email`}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 border-env-accent/40 bg-background/60 pl-9 focus-visible:border-env-accent focus-visible:ring-env-accent/50"
                placeholder="you@company.com"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${ids}-password`}>Password</Label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-env-accent" aria-hidden="true" />
              <Input
                id={`${ids}-password`}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 border-env-accent/40 bg-background/60 px-9 focus-visible:border-env-accent focus-visible:ring-env-accent/50"
                placeholder="Your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-env-accent hover:bg-env-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-env-accent"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <Switch checked={remember} onCheckedChange={setRemember} aria-label="Remember me" />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => onForgotPassword(email)}
              className="text-sm font-semibold text-env-accent underline-offset-4 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <FormMessages error={error} notice={notice} />
          <Button type="submit" disabled={busy} className="h-11 w-full bg-env-strong font-display text-base tracking-wide text-foreground hover:bg-env-accent hover:text-env-deep">
            {busy ? <Loader2 className="animate-spin" aria-hidden="true" /> : <LogIn aria-hidden="true" />}
            Sign In
          </Button>
        </form>
      ) : !codeSentTo ? (
        <form onSubmit={onSendCode} className="space-y-3" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor={`${ids}-phone`}>Phone number</Label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-env-accent" aria-hidden="true" />
              <Input
                id={`${ids}-phone`}
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11 border-env-accent/40 bg-background/60 pl-9 focus-visible:border-env-accent focus-visible:ring-env-accent/50"
                placeholder="+1 555 010 2030"
              />
            </div>
            <p className="text-xs text-foreground/70">We'll text you a one-time verification code.</p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <Switch checked={remember} onCheckedChange={setRemember} aria-label="Remember me" />
              Remember me
            </label>
            <button type="button" onClick={onHelp} className="text-sm font-semibold text-env-accent underline-offset-4 hover:underline">
              Can't receive texts?
            </button>
          </div>
          <FormMessages error={error} notice={notice} />
          <Button type="submit" disabled={busy} className="h-11 w-full bg-env-strong font-display text-base tracking-wide text-foreground hover:bg-env-accent hover:text-env-deep">
            {busy ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Phone aria-hidden="true" />}
            Send verification code
          </Button>
        </form>
      ) : (
        <form onSubmit={onVerifyCode} className="space-y-3" noValidate>
          <Label htmlFor={`${ids}-otp`}>Verification code</Label>
          <InputOTP id={`${ids}-otp`} maxLength={6} value={code} onChange={setCode} containerClassName="justify-center">
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} className="h-11 w-11 border-env-accent/50 bg-background/60 text-lg text-foreground" />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <FormMessages error={error} notice={notice} />
          <Button type="submit" disabled={busy} className="h-11 w-full bg-env-strong font-display text-base tracking-wide text-foreground hover:bg-env-accent hover:text-env-deep">
            {busy ? <Loader2 className="animate-spin" aria-hidden="true" /> : <LogIn aria-hidden="true" />}
            Verify &amp; Sign In
          </Button>
          <div className="flex justify-between text-sm">
            <button type="button" className="font-semibold text-env-accent hover:underline" onClick={() => setCodeSentTo(null)}>
              Change number
            </button>
            <button type="button" className="font-semibold text-env-accent hover:underline" onClick={(e) => onSendCode(e as unknown as React.FormEvent)}>
              Resend code
            </button>
          </div>
        </form>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={onSignUp}
        className="h-11 w-full border-env-accent/60 bg-transparent font-display tracking-wide text-env-accent hover:bg-env-base hover:text-foreground"
      >
        <UserPlus aria-hidden="true" />
        {context.signUpLabel}
      </Button>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-env-accent/20 pt-3 text-sm">
        <button type="button" onClick={onHelp} className="flex items-center gap-1.5 font-semibold text-env-accent hover:underline">
          <LifeBuoy className="h-4 w-4" aria-hidden="true" />
          Need help?
        </button>
        <button type="button" onClick={onOtherMethods} className="flex items-center gap-1.5 font-semibold text-env-accent hover:underline">
          <Waypoints className="h-4 w-4" aria-hidden="true" />
          Other sign-in methods
        </button>
      </div>
    </div>
  );
}

function FormMessages({ error, notice }: { error: string | null; notice: string | null }) {
  return (
    <div aria-live="polite">
      {error && <p className="rounded-md border border-destructive/60 bg-destructive/15 px-3 py-2 text-sm text-foreground">{error}</p>}
      {!error && notice && <p className="rounded-md border border-env-accent/50 bg-env-base/60 px-3 py-2 text-sm text-foreground">{notice}</p>}
    </div>
  );
}
