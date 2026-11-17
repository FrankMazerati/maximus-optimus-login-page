import { Building2, Check, UserRoundCheck, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { ENVIRONMENTS, ENVIRONMENT_ORDER, type EnvironmentId } from "@/lib/intellistack/environments";

const ICONS = { blue: UserRoundCheck, purple: Building2, green: Users } as const;

export function EnvironmentSelector({
  value,
  onChange,
}: {
  value: EnvironmentId;
  onChange: (env: EnvironmentId) => void;
}) {
  return (
    <section aria-labelledby="env-heading">
      <h2 id="env-heading" className="font-display text-lg font-bold tracking-wide text-foreground">
        Select Your Login Environment
      </h2>
      <p className="text-sm text-foreground/80">Choose your access type. Each option provides a secure, verified login experience.</p>
      <div role="radiogroup" aria-label="Login environment" className="mt-4 grid gap-3 md:grid-cols-3">
        {ENVIRONMENT_ORDER.map((id) => {
          const env = ENVIRONMENTS[id];
          const Icon = ICONS[id];
          const selected = value === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected}
              data-env={id}
              onClick={() => onChange(id)}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl border bg-env-base/80 p-4 text-left env-transition",
                "hover:-translate-y-0.5 hover:border-env-accent hover:bg-env-base active:translate-y-0 active:scale-[0.99]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-env-accent",
                selected ? "border-env-accent shadow-env-glow" : "border-env-accent/35 opacity-90",
              )}
            >
              <span
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-env-accent/60 bg-env-deep text-env-accent",
                  selected && "bg-env-strong text-foreground",
                )}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-sm font-bold uppercase tracking-wide text-foreground">{env.name}</span>
                <span className="mt-0.5 block text-xs text-foreground/80">{env.description}</span>
                <span className="mt-1 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-env-accent">
                  {env.themeName}
                </span>
              </span>
              {selected && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-env-accent text-env-deep">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="sr-only">Selected</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
