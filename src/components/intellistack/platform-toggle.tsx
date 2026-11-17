import { cn } from "@/lib/utils";
import { PLATFORMS, PLATFORM_ORDER, type PlatformId } from "@/lib/intellistack/environments";

export function PlatformToggle({ value, onChange }: { value: PlatformId; onChange: (p: PlatformId) => void }) {
  return (
    <div
      role="radiogroup"
      aria-label="IntelliStack business platform"
      className="grid grid-cols-3 gap-1 rounded-xl border border-env-accent/40 bg-env-deep/80 p-1 env-transition"
    >
      {PLATFORM_ORDER.map((id) => {
        const p = PLATFORMS[id];
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(id)}
            className={cn(
              "rounded-lg px-2 py-2 text-center env-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-env-accent",
              active
                ? "bg-env-strong text-foreground shadow-env-glow"
                : "text-foreground/80 hover:bg-env-base hover:text-foreground active:bg-env-strong/70",
            )}
          >
            <span className="block font-display text-xs font-bold uppercase tracking-[0.12em] sm:text-sm">{p.name}</span>
            <span className={cn("hidden text-[0.65rem] sm:block", active ? "text-foreground/90" : "text-env-accent")}>
              {p.tagline}
            </span>
          </button>
        );
      })}
    </div>
  );
}
