import { Link } from "@tanstack/react-router";

import { FOOTER_COLUMNS } from "@/lib/intellistack/site-content";
import { BrandLockup } from "./brand";

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-env-accent/25 bg-background/85 backdrop-blur-md">
      <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h2 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-env-accent env-transition">{col.heading}</h2>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.slug}>
                    <Link
                      to="/info/$slug"
                      params={{ slug: l.slug }}
                      className="text-sm text-footer-link underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-foreground/10 pt-6 md:flex-row md:items-center md:justify-between">
          <BrandLockup compact />
          <p className="text-xs text-footer-link">© 2026 IntelliStack Systems. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
