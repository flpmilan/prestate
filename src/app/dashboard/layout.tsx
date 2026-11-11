import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/login/actions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;
  if (!user) redirect("/login");

  const { data: organization } = await supabase
    .from("organizations")
    .select("name, slug")
    .eq("owner_id", user.id)
    .maybeSingle();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#FAF7F2]">
      <header className="flex items-center justify-between border-b border-[#E8E1D4] bg-[#FDFBF8] px-6 py-3.5">
        <Link href="/dashboard" className="flex items-baseline gap-2">
          <span className="text-base font-semibold tracking-tight text-[#1C1A17]" style={{ fontFamily: "var(--font-fraunces)" }}>
            Prestate
          </span>
          {organization ? <span className="text-sm text-[#9C8F7E]">· {organization.name}</span> : null}
        </Link>
        <form action={logout}>
          <button type="submit" className="text-sm font-medium text-[#6B6354] hover:text-[#1C1A17]">
            Kijelentkezés
          </button>
        </form>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
