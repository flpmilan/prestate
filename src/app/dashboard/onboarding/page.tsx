import { createOrganization } from "./actions";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-16">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-zinc-900">Üdv a Prestate-ben</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Először hozd létre a fejlesztői céged profilját.
        </p>

        {error ? (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}

        <form action={createOrganization} className="mt-6 flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            Cég / fejlesztő neve
            <input
              name="name"
              type="text"
              required
              placeholder="pl. Zöldfa Ingatlanfejlesztő Kft."
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            />
          </label>
          <button
            type="submit"
            className="mt-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Létrehozás
          </button>
        </form>
      </div>
    </div>
  );
}
