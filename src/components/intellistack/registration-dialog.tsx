import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { friendlyAuthError } from "@/lib/intellistack/auth";
import {
  ACCOUNT_TYPE_LABELS,
  APPROVAL_REQUIRED,
  REGISTRATION_CONFIGS,
  buildSignUpPayload,
  isFieldVisible,
  validateRegistration,
  type AccountType,
  type RegistrationField,
  type RegistrationKindId,
} from "@/lib/intellistack/registration-config";
import { cn } from "@/lib/utils";

type Result = { accountType: AccountType; email: string };

export function RegistrationDialog({
  kind,
  open,
  onOpenChange,
}: {
  kind: RegistrationKindId;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const config = REGISTRATION_CONFIGS[kind];
  const ids = useId();
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (open) {
      setValues({});
      setErrors({});
      setSubmitError(null);
      setResult(null);
    }
  }, [open, kind]);

  const set = (name: string, v: string) => {
    setValues((prev) => ({ ...prev, [name]: v }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    const found = validateRegistration(config, values);
    const active = Object.fromEntries(Object.entries(found).filter(([, v]) => v));
    setErrors(active);
    if (Object.keys(active).length) {
      const first = Object.keys(active)[0] ?? "";
      document.getElementById(`${ids}-${first}`)?.focus();
      return;
    }
    const payload = buildSignUpPayload(config, values);
    setBusy(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: { emailRedirectTo: window.location.origin, data: payload.metadata },
      });
      if (error) return setSubmitError(friendlyAuthError(error.message));
      setResult({ accountType: payload.accountType, email: payload.email });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto border-env-accent/50 bg-popover p-0 sm:rounded-xl">
        <div className="border-b border-env-accent/30 bg-env-base/60 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-foreground">{config.title}</DialogTitle>
            <DialogDescription className="text-foreground/80">{config.intro}</DialogDescription>
          </DialogHeader>
        </div>

        {result ? (
          <div className="space-y-5 px-6 pb-6">
            <div className="flex items-start gap-3 rounded-lg border border-env-accent/50 bg-env-deep/60 p-4">
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-env-accent" aria-hidden="true" />
              <div>
                <p className="font-display text-lg font-bold text-foreground">Registration received</p>
                <p className="text-sm text-foreground/85">
                  {ACCOUNT_TYPE_LABELS[result.accountType]} account for <strong>{result.email}</strong>.
                </p>
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-env-accent/60 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-env-accent">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Status: Pending email verification
                  {APPROVAL_REQUIRED[result.accountType] ? " → approval" : ""}
                </p>
              </div>
            </div>
            <div>
              <p className="mb-2 font-display text-sm font-bold uppercase tracking-wider text-env-accent">Next steps</p>
              <ol className="list-decimal space-y-1.5 pl-5 text-sm text-foreground">
                {config.nextSteps(result.accountType).map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>
            <Button className="w-full bg-env-strong text-foreground hover:bg-env-accent hover:text-env-deep" onClick={() => onOpenChange(false)}>
              Back to sign in
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="space-y-6 px-6 pb-6">
            {config.sections.map((section) => {
              const visible = section.fields.filter((f) => isFieldVisible(f, values));
              if (!visible.length) return null;
              return (
                <fieldset key={section.title} className="space-y-3">
                  <legend className="mb-2 font-display text-sm font-bold uppercase tracking-[0.14em] text-env-accent">
                    {section.title}
                  </legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {visible.map((f) => (
                      <FieldInput
                        key={f.name}
                        id={`${ids}-${f.name}`}
                        field={f}
                        value={values[f.name] ?? ""}
                        error={errors[f.name]}
                        onChange={(v) => set(f.name, v)}
                      />
                    ))}
                  </div>
                </fieldset>
              );
            })}
            <div aria-live="polite">
              {submitError && (
                <p className="rounded-md border border-destructive/60 bg-destructive/15 px-3 py-2 text-sm text-foreground">{submitError}</p>
              )}
            </div>
            <Button type="submit" disabled={busy} className="h-11 w-full bg-env-strong font-display tracking-wide text-foreground hover:bg-env-accent hover:text-env-deep">
              {busy && <Loader2 className="animate-spin" aria-hidden="true" />}
              {config.submitLabel}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function FieldInput({
  id,
  field,
  value,
  error,
  onChange,
}: {
  id: string;
  field: RegistrationField;
  value: string;
  error?: string | undefined;
  onChange: (v: string) => void;
}) {
  const describedBy = error ? `${id}-error` : field.hint ? `${id}-hint` : undefined;
  const inputCls = cn(
    "border-env-accent/40 bg-background/60 focus-visible:border-env-accent focus-visible:ring-env-accent/50",
    error && "border-destructive",
  );
  const label = (
    <>
      {field.label}
      {field.required && field.type !== "checkbox" && <span className="text-env-accent"> *</span>}
    </>
  );

  if (field.type === "checkbox") {
    return (
      <div className={cn("space-y-1", field.wide && "sm:col-span-2")}>
        <div className="flex items-start gap-2.5">
          <Checkbox
            id={id}
            checked={value === "true"}
            onCheckedChange={(c) => onChange(c === true ? "true" : "")}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className="mt-0.5 border-env-accent data-[state=checked]:bg-env-strong data-[state=checked]:text-foreground"
          />
          <Label htmlFor={id} className="text-sm font-normal leading-snug text-foreground">
            {label}
          </Label>
        </div>
        {error && <p id={`${id}-error`} className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div className={cn("space-y-1.5", (field.wide || field.type === "textarea") && "sm:col-span-2")}>
      <Label htmlFor={id} className="text-foreground">
        {label}
      </Label>
      {field.type === "select" ? (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger id={id} className={inputCls} aria-invalid={!!error} aria-describedby={describedBy}>
            <SelectValue placeholder="Select…" />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : field.type === "textarea" ? (
        <Textarea
          id={id}
          value={value}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
          aria-invalid={!!error}
          aria-describedby={describedBy}
        />
      ) : (
        <Input
          id={id}
          type={field.type}
          value={value}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          autoComplete={
            field.type === "password" ? "new-password" : field.type === "email" ? "email" : field.type === "tel" ? "tel" : undefined
          }
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
          aria-invalid={!!error}
          aria-describedby={describedBy}
        />
      )}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-destructive">{error}</p>
      ) : field.hint ? (
        <p id={`${id}-hint`} className="text-xs text-foreground/65">{field.hint}</p>
      ) : null}
    </div>
  );
}
