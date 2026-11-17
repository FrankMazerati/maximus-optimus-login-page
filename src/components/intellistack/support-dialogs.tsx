import { Link } from "@tanstack/react-router";
import { Bot, KeyRound, LibraryBig, Loader2, MailCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { friendlyAuthError } from "@/lib/intellistack/auth";
import type { LoginContext } from "@/lib/intellistack/environments";

export function ForgotPasswordDialog({
  open,
  onOpenChange,
  initialEmail,
  context,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initialEmail: string;
  context: LoginContext;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (open) {
      setEmail(initialEmail);
      setError(null);
      setSent(false);
    }
  }, [open, initialEmail]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = z.string().trim().email().max(255).safeParse(email);
    if (!parsed.success) return setError("Enter a valid email address.");
    setBusy(true);
    setError(null);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(parsed.data, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (err) return setError(friendlyAuthError(err.message));
      setSent(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-env-accent/50 bg-popover">
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">Reset your password</DialogTitle>
          <DialogDescription className="text-foreground/80">
            {context.heading} — we'll email you a secure link to choose a new password.
          </DialogDescription>
        </DialogHeader>
        {sent ? (
          <div className="flex items-start gap-3 rounded-lg border border-env-accent/50 bg-env-deep/60 p-4 text-sm text-foreground">
            <MailCheck className="h-5 w-5 shrink-0 text-env-accent" aria-hidden="true" />
            <p>
              If an account exists for <strong>{email}</strong>, a reset link is on its way. The link opens a page where you can set a new
              password.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="reset-email">Email address</Label>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-env-accent/40 bg-background/60 focus-visible:border-env-accent focus-visible:ring-env-accent/50"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={busy} className="w-full bg-env-strong text-foreground hover:bg-env-accent hover:text-env-deep">
              {busy ? <Loader2 className="animate-spin" aria-hidden="true" /> : <KeyRound aria-hidden="true" />}
              Send reset link
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function HelpDialog({
  open,
  onOpenChange,
  context,
  onForgotPassword,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  context: LoginContext;
  onForgotPassword: () => void;
}) {
  const items = [
    {
      Icon: KeyRound,
      title: "I forgot my password",
      text: "Get a secure reset link by email.",
      action: (
        <Button size="sm" variant="outline" className="border-env-accent/60 text-env-accent hover:bg-env-base hover:text-foreground" onClick={onForgotPassword}>
          Reset password
        </Button>
      ),
    },
    {
      Icon: Bot,
      title: "Ask Help Buddy",
      text: "Intelligent assistance, guidance, and platform support.",
      action: (
        <Button asChild size="sm" variant="outline" className="border-env-accent/60 text-env-accent hover:bg-env-base hover:text-foreground">
          <Link to="/info/$slug" params={{ slug: "help-buddy" }}>Open Help Buddy</Link>
        </Button>
      ),
    },
    {
      Icon: LibraryBig,
      title: "Browse the Help Center",
      text: "Guides for signing in, registration and account approval.",
      action: (
        <Button asChild size="sm" variant="outline" className="border-env-accent/60 text-env-accent hover:bg-env-base hover:text-foreground">
          <Link to="/info/$slug" params={{ slug: "help-center" }}>Help Center</Link>
        </Button>
      ),
    },
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-env-accent/50 bg-popover">
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">Need help signing in?</DialogTitle>
          <DialogDescription className="text-foreground/80">{context.helpNote}</DialogDescription>
        </DialogHeader>
        <ul className="space-y-3">
          {items.map(({ Icon, title, text, action }) => (
            <li key={title} className="flex flex-wrap items-center gap-3 rounded-lg border border-env-accent/30 bg-env-deep/50 p-3">
              <Icon className="h-5 w-5 text-env-accent" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground">{title}</p>
                <p className="text-xs text-foreground/75">{text}</p>
              </div>
              {action}
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
