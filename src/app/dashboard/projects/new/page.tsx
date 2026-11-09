import { createProject } from "./actions";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <h1 className="text-lg font-semibold text-zinc-900">Új projekt</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Add meg a projekt alapadatait. A lakáslistát és az alaprajzokat a létrehozás után töltheted fel.
      </p>

      {error ? (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <form action={createProject} className="mt-6 flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6">
        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          Projekt neve
          <input
            name="name"
            required
            placeholder="pl. Zöldfa Residence"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          Cím
          <input
            name="address"
            placeholder="pl. Budapest, XI. kerület, Zöldfa utca 12."
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          Leírás
          <textarea
            name="description"
            rows={4}
            placeholder="Rövid bemutató szöveg a projektről."
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          />
        </label>
        <button
          type="submit"
          className="mt-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Projekt létrehozása
        </button>
      </form>
    </div>
  );
}
