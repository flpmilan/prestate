import { login, signup } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const { error, notice } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-16">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-zinc-900">Prestate</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Jelentkezz be, vagy hozz létre egy fiókot a fejlesztői felülethez.
        </p>

        {error ? (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}
        {notice ? (
          <p className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {notice}
          </p>
        ) : null}

        <form className="mt-6 flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            E-mail
            <input
              name="email"
              type="email"
              required
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            Jelszó
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            />
          </label>

          <div className="mt-2 flex flex-col gap-2">
            <button
              formAction={login}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Bejelentkezés
            </button>
            <button
              formAction={signup}
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Regisztráció
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
