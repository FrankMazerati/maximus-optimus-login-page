import shield from "@/assets/intellistack-shield.png";
import { cn } from "@/lib/utils";

export function Shield({ className }: { className?: string }) {
  return (
    <img
      src={shield}
      alt="IntelliStack Systems shield"
      width={184}
      height={220}
      className={cn("h-14 w-auto drop-shadow-[0_0_14px_color-mix(in_oklab,var(--env-accent)_45%,transparent)]", className)}
    />
  );
}

export function SecuritySignature({ className }: { className?: string }) {
  return (
    <p className={cn("font-display text-[0.65rem] font-semibold uppercase tracking-[0.2em] env-transition", className)}>
      <span className="text-env-accent">Secured.</span> <span className="text-env-accent">Trusted.</span>{" "}
      <span className="text-env-accent">&amp;</span> <span className="text-env-accent">Compliant.</span>
    </p>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="leading-none">
      <p className={cn("font-display font-bold tracking-[0.08em] text-foreground", compact ? "text-lg" : "text-xl sm:text-2xl")}>
        INTELLISTACK
      </p>
      <p className={cn("font-display font-semibold tracking-[0.42em] text-foreground/90", compact ? "text-[0.6rem]" : "text-xs")}>
        SYSTEMS
      </p>
    </div>
  );
}

export function BrandLockup({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Shield className={compact ? "h-11" : "h-14 sm:h-16"} />
      <div className="space-y-1.5">
        <Wordmark compact={compact} />
        <SecuritySignature />
      </div>
    </div>
  );
}
