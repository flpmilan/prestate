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
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50">
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-3">
        <Link href="/dashboard" className="font-semibold text-zinc-900">
          Prestate{organization ? ` · ${organization.name}` : ""}
        </Link>
        <form action={logout}>
          <button type="submit" className="text-sm text-zinc-500 hover:text-zinc-900">
            Kijelentkezés
          </button>
        </form>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
