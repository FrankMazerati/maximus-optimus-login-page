import { useNavigate } from "@tanstack/react-router";
import { BadgeCheck, Check, ChevronDown, Grid3x3, Loader2, Search, X } from "lucide-react";
import { forwardRef, useMemo, useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInWithCloudProvider } from "@/lib/intellistack/auth";
import type { EnvironmentId } from "@/lib/intellistack/environments";
import {
  DIRECTORY_PROVIDERS,
  FEATURED_PROVIDERS,
  groupByCategory,
  providerLogoUrl,
  searchProviders,
  type DirectoryProvider,
  type FeaturedProvider,
} from "@/lib/intellistack/identity-providers";
import { cn } from "@/lib/utils";
import { FeaturedProviderLogo } from "./provider-logos";

export const ProviderPanel = forwardRef<HTMLDivElement, { env: EnvironmentId; directoryOpen: boolean; onDirectoryOpenChange: (o: boolean) => void }>(
  function ProviderPanel({ env, directoryOpen, onDirectoryOpenChange }, ref) {
    const navigate = useNavigate();
    const [pending, setPending] = useState<string | null>(null);

    async function onFeatured(p: FeaturedProvider) {
      if (!p.environments.includes(env)) {
        toast.info(`${p.name} isn't offered in this login environment.`);
        return;
      }
      if (!p.cloudProvider) {
        toast.info(`${p.name} sign-in hasn't been connected yet`, {
          description: "An IntelliStack administrator needs to set up this provider before it can be used.",
        });
        return;
      }
      setPending(p.id);
      try {
        const result = await signInWithCloudProvider(p.cloudProvider);
        if (result.error) {
          toast.error(`Couldn't sign in with ${p.name}`, { description: result.error.message });
          return;
        }
        if (result.redirected) return;
        await navigate({ to: "/account" });
      } finally {
        setPending(null);
      }
    }

    return (
      <div ref={ref} className="space-y-4 scroll-mt-24" id="identity-providers">
        <div>
          <h3 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
            <BadgeCheck className="h-5 w-5 text-env-accent" aria-hidden="true" />
            Verified Identity Providers
          </h3>
          <p className="text-sm text-foreground/80">Sign in with your existing organizational account.</p>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {FEATURED_PROVIDERS.map((p) => {
            const available = p.environments.includes(env);
            const ready = available && !!p.cloudProvider;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onFeatured(p)}
                disabled={pending !== null}
                aria-label={`Continue with ${p.name}`}
                className={cn(
                  "group relative flex min-h-[4.75rem] flex-col items-center justify-center gap-1.5 rounded-lg border px-2 py-3 text-center env-transition",
                  "hover:border-env-accent hover:shadow-env-glow active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-env-accent",
                  "bg-provider-tile text-foreground",
                  available ? "border-env-accent/45" : "border-env-accent/20 opacity-60",
                )}
              >
                {pending === p.id ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <FeaturedProviderLogo id={p.id} />}
                <span className="text-[0.7rem] leading-tight opacity-80">Continue with</span>
                <span className="text-xs font-semibold leading-tight">{p.name}</span>
                {!ready && (
                  <span className={cn("absolute right-1.5 top-1.5 rounded px-1 text-[0.55rem] font-semibold uppercase tracking-wider", "bg-env-deep text-env-accent")}>
                    {available ? "Setup needed" : "N/A"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <ProviderDirectory open={directoryOpen} onOpenChange={onDirectoryOpenChange} />
      </div>
    );
  },
);

function ProviderDirectory({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<DirectoryProvider | null>(null);
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

  const results = useMemo(() => searchProviders(query), [query]);
  const popular = useMemo(() => DIRECTORY_PROVIDERS.filter((p) => p.popular), []);
  const groups = useMemo(() => groupByCategory(DIRECTORY_PROVIDERS.filter((p) => !p.popular)), []);

  const toggle = (p: DirectoryProvider) => setSelected((cur) => (cur?.id === p.id ? null : p));
  const toggleCategory = (c: string) =>
    setOpenCategories((s) => {
      const next = new Set(s);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });

  return (
    <div className="rounded-lg border border-env-accent/45 bg-env-deep/60 env-transition">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="provider-directory"
        onClick={() => onOpenChange(!open)}
        className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-env-base/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-env-accent"
      >
        <Grid3x3 className="h-5 w-5 text-env-accent" aria-hidden="true" />
        <span className="flex-1">
          <span className="block font-display text-sm font-bold uppercase tracking-wide text-foreground">
            Other Identity Providers ({DIRECTORY_PROVIDERS.length >= 100 ? "100+" : DIRECTORY_PROVIDERS.length})
          </span>
          <span className="block text-xs text-foreground/75">Search and select from additional providers</span>
        </span>
        <ChevronDown className={cn("h-5 w-5 text-env-accent transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>

      {open && (
        <div id="provider-directory" className="space-y-3 border-t border-env-accent/30 p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-env-accent" aria-hidden="true" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by provider name or category"
              aria-label="Search identity providers"
              className="h-10 border-env-accent/40 bg-background/60 pl-9 focus-visible:border-env-accent focus-visible:ring-env-accent/50"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-env-accent hover:bg-env-base">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {selected && (
            <div className="flex flex-wrap items-center gap-2 rounded-md border border-env-accent bg-env-base/60 p-2">
              <ProviderLogo provider={selected} />
              <span className="flex-1 text-sm font-semibold text-foreground">{selected.name} selected</span>
              <Button
                size="sm"
                className="bg-env-strong text-foreground hover:bg-env-accent hover:text-env-deep"
                onClick={() =>
                  toast.info(`${selected.name} sign-in hasn't been connected yet`, {
                    description: "An IntelliStack administrator needs to set up this provider before it can be used.",
                  })
                }
              >
                Continue
              </Button>
              <Button size="sm" variant="ghost" className="text-env-accent hover:bg-env-base hover:text-foreground" onClick={() => setSelected(null)}>
                Deselect
              </Button>
            </div>
          )}

          <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
            {query ? (
              results.length ? (
                <ul className="grid gap-1.5" aria-label="Search results">
                  {results.map((p) => (
                    <ProviderRow key={p.id} provider={p} selected={selected?.id === p.id} onToggle={toggle} />
                  ))}
                </ul>
              ) : (
                <p className="py-4 text-center text-sm text-foreground/75">No providers match “{query}”.</p>
              )
            ) : (
              <>
                <div>
                  <p className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-env-accent">Popular providers</p>
                  <ul className="grid gap-1.5 sm:grid-cols-2" aria-label="Popular providers">
                    {popular.map((p) => (
                      <ProviderRow key={p.id} provider={p} selected={selected?.id === p.id} onToggle={toggle} compact />
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-env-accent">More providers by category</p>
                  <ul className="space-y-1">
                    {groups.map((g) => {
                      const isOpen = openCategories.has(g.category);
                      return (
                        <li key={g.category} className="rounded-md border border-env-accent/20">
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            onClick={() => toggleCategory(g.category)}
                            className="flex w-full items-center justify-between px-2.5 py-2 text-sm text-foreground hover:bg-env-base/50"
                          >
                            <span>
                              {g.category} <span className="text-foreground/60">({g.items.length})</span>
                            </span>
                            <ChevronDown className={cn("h-4 w-4 text-env-accent transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
                          </button>
                          {isOpen && (
                            <ul className="grid gap-1.5 p-1.5 sm:grid-cols-2">
                              {g.items.map((p) => (
                                <ProviderRow key={p.id} provider={p} selected={selected?.id === p.id} onToggle={toggle} compact />
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ProviderLogo({ provider }: { provider: DirectoryProvider }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-env-base text-[0.65rem] font-bold text-foreground" aria-hidden="true">
        {provider.name.slice(0, 2).toUpperCase()}
      </span>
    );
  }
  return (
    <img
      src={providerLogoUrl(provider.domain)}
      alt=""
      aria-hidden="true"
      width={24}
      height={24}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-6 w-6 shrink-0 rounded bg-foreground/95 p-0.5"
    />
  );
}

function ProviderRow({
  provider,
  selected,
  onToggle,
  compact,
}: {
  provider: DirectoryProvider;
  selected: boolean;
  onToggle: (p: DirectoryProvider) => void;
  compact?: boolean;
}) {
  return (
    <li>
      <button
        type="button"
        aria-pressed={selected}
        onClick={() => onToggle(provider)}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-md border px-2.5 py-2 text-left env-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-env-accent",
          selected ? "border-env-accent bg-env-base" : "border-env-accent/20 bg-background/40 hover:border-env-accent/70",
        )}
      >
        <ProviderLogo provider={provider} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-foreground">{provider.name}</span>
          <span className="block truncate text-[0.7rem] text-foreground/70">{compact ? provider.category : `${provider.category} · ${provider.description}`}</span>
        </span>
        {selected && <Check className="h-4 w-4 shrink-0 text-env-accent" aria-hidden="true" />}
      </button>
    </li>
  );
}
