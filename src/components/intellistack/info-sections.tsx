import { Link } from "@tanstack/react-router";
import { ArrowRight, Bot, BriefcaseBusiness, LayoutDashboard, LibraryBig, Network } from "lucide-react";
import { useState } from "react";

import { INFO_SECTIONS, type InfoSectionId } from "@/lib/intellistack/site-content";
import { cn } from "@/lib/utils";

const ICONS: Record<InfoSectionId, typeof Bot> = {
  "system-center": LayoutDashboard,
  connectors: Network,
  intellibase: LibraryBig,
  "help-buddy": Bot,
  "bring-the-work-to-you": BriefcaseBusiness,
};

export function InfoSections() {
  const [selected, setSelected] = useState<InfoSectionId | null>(null);
  return (
    <nav aria-label="IntelliStack platform" className="glass-panel rounded-2xl p-3 env-transition">
      <ul className="space-y-2">
        {INFO_SECTIONS.map((s) => {
          const Icon = ICONS[s.id];
          const active = selected === s.id;
          return (
            <li key={s.id}>
              <button
                type="button"
                aria-expanded={active}
                aria-controls={`info-${s.id}`}
                onClick={() => setSelected(active ? null : s.id)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border p-3 text-left env-transition",
                  "hover:border-env-accent/70 hover:bg-env-base/50 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-env-accent",
                  active ? "border-env-accent bg-env-base/70 shadow-env-glow" : "border-transparent",
                )}
              >
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-env-accent/60 text-env-accent env-transition",
                    active ? "bg-env-strong text-foreground" : "bg-env-deep",
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-sm font-bold uppercase tracking-wide text-env-accent">{s.title}</span>
                  <span className="block text-xs leading-snug text-foreground">{s.description}</span>
                </span>
              </button>
              {active && (
                <div id={`info-${s.id}`} className="mx-2 mt-1 rounded-lg border border-env-accent/30 bg-background/50 p-3 text-xs text-foreground">
                  <p>Sign in to open {s.title} inside the Maximus Optimus platform.</p>
                  <Link
                    to="/info/$slug"
                    params={{ slug: s.id }}
                    className="mt-2 inline-flex items-center gap-1 font-semibold text-env-accent hover:underline"
                  >
                    Learn more about {s.title}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
