import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <header className="flex items-center justify-between px-6 py-5">
        <span className="text-lg font-semibold text-zinc-900">Prestate</span>
        <Link
          href="/login"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Bejelentkezés
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center px-6 py-20 text-center">
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-zinc-900">
          Értékesítési weboldal a lakásprojektednek, percek alatt
        </h1>
        <p className="mt-4 max-w-xl text-lg text-zinc-600">
          Töltsd fel a lakáslistát Excelben és az alaprajzokat, mi elkészítjük belőle a publikus
          weboldalt — saját domainnel vagy aldomainnel, élő elérhetőséggel és beépített
          ajánlatkérő űrlappal.
        </p>
        <Link
          href="/login"
          className="mt-8 rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Projekt létrehozása
        </Link>

        <div className="mt-20 grid max-w-3xl grid-cols-1 gap-6 text-left sm:grid-cols-3">
          <div>
            <h2 className="font-medium text-zinc-900">Excel import</h2>
            <p className="mt-1 text-sm text-zinc-500">
              A meglévő lakáslistádat egy kattintással betöltöd, nincs kézi adatbevitel.
            </p>
          </div>
          <div>
            <h2 className="font-medium text-zinc-900">Alaprajzok</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Tölts fel alaprajzokat, és kösd őket a lakásokhoz típus szerint.
            </p>
          </div>
          <div>
            <h2 className="font-medium text-zinc-900">Élő ajánlatkérés</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Az érdeklődők közvetlenül a weboldalról kérhetnek ajánlatot.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
