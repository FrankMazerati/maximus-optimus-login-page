import { BrandLockup } from "./brand";

export function SiteHeader() {
  return (
    <header className="relative z-10 border-b border-env-accent/25 bg-background/55 backdrop-blur-md env-transition">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center lg:px-10">
        <BrandLockup />
        <div className="hidden h-14 w-px bg-env-accent/40 md:block" aria-hidden="true" />
        <p className="font-display text-xs font-bold uppercase leading-snug tracking-[0.12em] text-foreground sm:text-sm md:text-base xl:whitespace-nowrap xl:text-sm 2xl:text-base">
          See everything <span className="env-text-glow env-transition">locally.</span>{" "}
          Connect everything <span className="env-text-glow env-transition">globally.</span>{" "}
          Powered by <span className="env-text-glow env-transition">intelligence.</span>
        </p>
      </div>
    </header>
  );
}
