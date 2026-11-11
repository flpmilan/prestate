import { createOrganization } from "./actions";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center bg-[#FAF7F2] px-4 py-16">
      <div className="w-full max-w-sm rounded-xl border border-[#E8E1D4] bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-[#1C1A17]" style={{ fontFamily: "var(--font-fraunces)" }}>
          Üdv a Prestate-ben
        </h1>
        <p className="mt-1 text-sm text-[#6B6354]">
          Először hozd létre a fejlesztői céged profilját.
        </p>

        {error ? <p className="mt-4 rounded-md bg-[#FBEAE3] px-3 py-2 text-sm text-[#A8402A]">{error}</p> : null}

        <form action={createOrganization} className="mt-6 flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm text-[#1C1A17]">
            Cég / fejlesztő neve
            <input
              name="name"
              type="text"
              required
              placeholder="pl. Zöldfa Ingatlanfejlesztő Kft."
              className="rounded-md border border-[#E3DCCB] bg-white px-3 py-2 text-sm outline-none placeholder:text-[#B2A990] focus:border-[#9C5636] focus:ring-2 focus:ring-[#9C5636]/15"
            />
          </label>
          <button
            type="submit"
            className="mt-2 rounded-md bg-[#1C1A17] px-4 py-2 text-sm font-medium text-white hover:bg-[#2E2A24]"
          >
            Létrehozás
          </button>
        </form>
      </div>
    </div>
  );
}
