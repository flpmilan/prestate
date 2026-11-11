import { login, signup } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const { error, notice } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center bg-[#FAF7F2] px-4 py-16">
      <div className="w-full max-w-sm rounded-xl border border-[#E8E1D4] bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-[#1C1A17]" style={{ fontFamily: "var(--font-fraunces)" }}>
          Prestate
        </h1>
        <p className="mt-1 text-sm text-[#6B6354]">
          Jelentkezz be, vagy hozz létre egy fiókot a fejlesztői felülethez.
        </p>

        {error ? <p className="mt-4 rounded-md bg-[#FBEAE3] px-3 py-2 text-sm text-[#A8402A]">{error}</p> : null}
        {notice ? (
          <p className="mt-4 rounded-md bg-[#E6EFE4] px-3 py-2 text-sm text-[#3D6B3A]">{notice}</p>
        ) : null}

        <form className="mt-6 flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm text-[#1C1A17]">
            E-mail
            <input
              name="email"
              type="email"
              required
              className="rounded-md border border-[#E3DCCB] bg-white px-3 py-2 text-sm outline-none placeholder:text-[#B2A990] focus:border-[#9C5636] focus:ring-2 focus:ring-[#9C5636]/15"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-[#1C1A17]">
            Jelszó
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="rounded-md border border-[#E3DCCB] bg-white px-3 py-2 text-sm outline-none placeholder:text-[#B2A990] focus:border-[#9C5636] focus:ring-2 focus:ring-[#9C5636]/15"
            />
          </label>

          <div className="mt-2 flex flex-col gap-2">
            <button
              formAction={login}
              className="rounded-md bg-[#1C1A17] px-4 py-2 text-sm font-medium text-white hover:bg-[#2E2A24]"
            >
              Bejelentkezés
            </button>
            <button
              formAction={signup}
              className="rounded-md border border-[#E3DCCB] bg-white px-4 py-2 text-sm font-medium text-[#1C1A17] hover:bg-[#F3EFE7]"
            >
              Regisztráció
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
