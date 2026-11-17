import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { BrandLockup } from "@/components/intellistack/brand";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { environmentForAccountType } from "@/lib/intellistack/environments";
import { ACCOUNT_TYPE_LABELS } from "@/lib/intellistack/registration-config";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "Your account — IntelliStack Systems" },
      { name: "description", content: "Your IntelliStack account status." },
      { property: "og:title", content: "Your account — IntelliStack Systems" },
      { property: "og:description", content: "Your IntelliStack account status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AccountPage,
});

const STATUS_TEXT: Record<string, string> = {
  pending_email_verification: "Pending email verification",
  pending_approval: "Pending administrator approval",
  active: "Active",
  rejected: "Not approved",
  suspended: "Suspended",
};

function AccountPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["my-registration"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data: reg } = await supabase.from("account_registrations").select("*").eq("user_id", u.user!.id).maybeSingle();
      return { email: u.user?.email, reg };
    },
  });
  const env = data?.reg ? environmentForAccountType(data.reg.account_type).env : "blue";

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <div data-env={env} className="min-h-screen px-4 py-10 sm:px-10">
      <BrandLockup />
      <div className="glass-panel mx-auto mt-12 max-w-xl space-y-4 rounded-2xl p-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Your IntelliStack account</h1>
        {isLoading ? (
          <p className="text-foreground/80">Loading…</p>
        ) : data?.reg ? (
          <>
            <p className="text-foreground/85">{data.reg.display_name} · {data.email}</p>
            <p className="text-foreground">Account type: <span className="text-env-accent">{ACCOUNT_TYPE_LABELS[data.reg.account_type]}</span></p>
            <p className="text-foreground">Status: <span className="text-env-accent">{STATUS_TEXT[data.reg.status]}</span></p>
          </>
        ) : (
          <p className="text-foreground/85">You're signed in as {data?.email}, but no IntelliStack registration is linked to this account yet.</p>
        )}
        <Button onClick={signOut} className="bg-env-strong text-foreground">Sign out</Button>
      </div>
    </div>
  );
}
