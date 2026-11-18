import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { EnvironmentSelector } from "@/components/intellistack/environment-selector";
import { Hero } from "@/components/intellistack/hero";
import { InfoSections } from "@/components/intellistack/info-sections";
import { LoginForm } from "@/components/intellistack/login-form";
import { PlatformToggle } from "@/components/intellistack/platform-toggle";
import { ProviderPanel } from "@/components/intellistack/provider-panel";
import { RegistrationDialog } from "@/components/intellistack/registration-dialog";
import { SiteFooter } from "@/components/intellistack/site-footer";
import { SiteHeader } from "@/components/intellistack/site-header";
import { ForgotPasswordDialog, HelpDialog } from "@/components/intellistack/support-dialogs";
import { useBackground } from "@/hooks/use-background";
import { getLoginContext, type EnvironmentId, type PlatformId } from "@/lib/intellistack/environments";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IntelliStack Systems — Maximus Optimus Global Operations Center" },
      { name: "description", content: "Secure sign-in and registration for IntelliStack employees, businesses, IntelliStaff, IntelliHire, IntelliWork and tenants." },
      { property: "og:title", content: "IntelliStack Systems — Maximus Optimus" },
      { property: "og:description", content: "One World. One System. One Intelligent Network. Secure access to the Global Operations Center." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const background = useBackground();
  const [env, setEnv] = useState<EnvironmentId>("blue");
  const [platform, setPlatform] = useState<PlatformId>("intellistaff");
  const [registerOpen, setRegisterOpen] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const providersRef = useRef<HTMLDivElement>(null);
  const context = getLoginContext(env, platform);

  useEffect(() => {
    document.documentElement.setAttribute("data-env", env);
  }, [env]);

  return (
    <div data-env={env} className="relative min-h-screen overflow-x-hidden">
      <div aria-hidden="true" className="fixed inset-0 -z-0 bg-cover bg-center" style={{ backgroundImage: `url(${background.src})` }} />
      <div aria-hidden="true" className="fixed inset-0 -z-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
      <SiteHeader />
      <Hero />
      <main className="relative z-10 mx-auto grid max-w-[1600px] gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-12 lg:px-10">
        <p
          className="text-center whitespace-nowrap font-display font-bold uppercase tracking-[0.16em] text-foreground env-transition lg:col-span-12"
          style={{ fontSize: "clamp(0.55rem, 2.3vw, 1.25rem)" }}
        >
          One <span className="text-env-accent">World.</span> One <span className="text-env-accent">System.</span> One
          Intelligent <span className="text-env-accent">Network.</span>
        </p>
        <div className="glass-panel space-y-6 rounded-2xl p-4 sm:p-6 lg:col-span-9 env-transition">
          <EnvironmentSelector value={env} onChange={setEnv} />
          {env === "purple" && <PlatformToggle value={platform} onChange={setPlatform} />}
          <div className="grid gap-6 rounded-xl border border-env-accent/30 bg-background/40 p-4 md:grid-cols-2">
            <LoginForm
              context={context}
              onSignUp={() => setRegisterOpen(true)}
              onForgotPassword={(e) => {
                setForgotEmail(e);
                setForgotOpen(true);
              }}
              onHelp={() => setHelpOpen(true)}
              onOtherMethods={() => {
                setDirectoryOpen(true);
                providersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            />
            <ProviderPanel ref={providersRef} env={env} directoryOpen={directoryOpen} onDirectoryOpenChange={setDirectoryOpen} />
          </div>
        </div>
        <aside className="lg:col-span-3">
          <InfoSections />
        </aside>
      </main>
      <SiteFooter />
      <RegistrationDialog kind={context.registration} open={registerOpen} onOpenChange={setRegisterOpen} />
      <ForgotPasswordDialog open={forgotOpen} onOpenChange={setForgotOpen} initialEmail={forgotEmail} context={context} />
      <HelpDialog
        open={helpOpen}
        onOpenChange={setHelpOpen}
        context={context}
        onForgotPassword={() => {
          setHelpOpen(false);
          setForgotOpen(true);
        }}
      />
    </div>
  );
}
