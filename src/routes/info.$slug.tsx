import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { BrandLockup } from "@/components/intellistack/brand";
import { INFO_PAGES } from "@/lib/intellistack/site-content";

export const Route = createFileRoute("/info/$slug")({
  loader: ({ params }) => {
    const page = INFO_PAGES[params.slug];
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} — IntelliStack Systems` : "Unavailable — IntelliStack Systems" },
      { name: "description", content: loaderData?.summary ?? "IntelliStack Systems" },
      { property: "og:title", content: loaderData?.title ?? "IntelliStack Systems" },
      { property: "og:description", content: loaderData?.summary ?? "IntelliStack Systems" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: InfoPage,
});

function InfoPage() {
  const page = Route.useLoaderData();
  return (
    <div data-env="blue" className="min-h-screen px-4 py-10 sm:px-10">
      <BrandLockup />
      <div className="glass-panel mx-auto mt-12 max-w-2xl rounded-2xl p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-env-accent">{page.section}</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-foreground">{page.title}</h1>
        <p className="mt-3 text-foreground/85">{page.summary}</p>
        <p className="mt-3 text-sm text-foreground/70">Full content for this page is coming soon.</p>
        <Link to="/" className="mt-6 inline-block font-semibold text-env-accent hover:underline">← Back to sign in</Link>
      </div>
    </div>
  );
}
