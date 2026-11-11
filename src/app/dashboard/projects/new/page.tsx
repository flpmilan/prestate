import { createProject } from "./actions";
import { ui } from "@/lib/ui";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <h1 className={ui.heading} style={{ fontFamily: "var(--font-fraunces)" }}>
        Új projekt
      </h1>
      <p className={`mt-1 ${ui.subtext}`}>
        Add meg a projekt alapadatait. A design és a tartalom feltöltése a következő lépésekben
        történik.
      </p>

      {error ? <p className={`mt-4 ${ui.errorBanner}`}>{error}</p> : null}

      <form action={createProject} className={`mt-6 flex flex-col gap-4 p-6 ${ui.card}`}>
        <label className="flex flex-col gap-1 text-sm text-[#1C1A17]">
          Projekt neve
          <input name="name" required placeholder="pl. Zöldfa Residence" className={ui.input} />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#1C1A17]">
          Cím
          <input
            name="address"
            placeholder="pl. Budapest, XI. kerület, Zöldfa utca 12."
            className={ui.input}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#1C1A17]">
          Leírás
          <textarea
            name="description"
            rows={4}
            placeholder="Rövid bemutató szöveg a projektről."
            className={ui.input}
          />
        </label>
        <button type="submit" className={`mt-2 ${ui.buttonAccent}`}>
          Projekt létrehozása
        </button>
      </form>
    </div>
  );
}
