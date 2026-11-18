export function Hero() {
  return (
    <section className="relative z-10 mx-auto max-w-[1600px] px-4 pb-6 pt-10 sm:px-6 sm:pt-14 lg:px-10">
      <h1 className="font-display text-[2.1rem] font-extrabold uppercase leading-none tracking-[0.04em] text-foreground min-[420px]:text-5xl sm:whitespace-nowrap sm:text-6xl lg:text-7xl">
        Maximus <span className="env-text-glow env-transition">Optimus</span>
      </h1>
      <p className="mt-3 font-display text-lg font-semibold uppercase tracking-[0.22em] text-foreground sm:text-2xl">
        Global Operations Center
      </p>
      <p
        className="mt-5 whitespace-nowrap font-display font-bold uppercase tracking-[0.16em] text-foreground env-transition"
        style={{ fontSize: "clamp(0.5rem, 2.15vw, 1.05rem)" }}
      >
        One <span className="text-env-accent">World.</span> One <span className="text-env-accent">System.</span> One
        Intelligent <span className="text-env-accent">Network.</span>
      </p>
    </section>
  );
}
