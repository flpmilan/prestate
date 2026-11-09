# Prestate

Önkiszolgáló SaaS ingatlanfejlesztőknek: lakáslista (Excel) + alaprajzok feltöltése, és belőle
publikus értékesítési weboldal aldomainnel vagy saját domainnel, beépített ajánlatkérő űrlappal.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind) — hosting: Vercel
- **Supabase** — Postgres + Auth + Storage, Row Level Security-vel

## Fejlesztés

```bash
npm install
npm run dev
```

A `.env.local` már tartalmazza a Supabase projekt URL-jét és publishable kulcsát.

## Hogyan működik a multi-tenant routing

A `src/proxy.ts` (Next.js "proxy", korábbi nevén middleware) a `Host` fejléc alapján eldönti,
hogy a kérés a root domainre (`prestate.hu` → marketing oldal + `/dashboard`) vagy egy projekt
aldomainjére/egyedi domainjére érkezett-e. Utóbbi esetben a kérést belsőleg a
`/sites/[tenant]` route-ra írja át, ahol `tenant` a projekt slugja vagy a hozzárendelt egyedi
domain.

Helyi fejlesztés közben egy publikált projekt közvetlenül elérhető:
- `http://localhost:3000/sites/<slug>` (preview út), vagy
- `http://<slug>.localhost:3000` (valódi aldomain-routing teszteléséhez)

## Adatmodell

`organizations` (fejlesztő cég) → `projects` (lakóprojekt) → `units` (lakások) és
`floor_plans` (alaprajzok, több lakáshoz is rendelhetők). `leads` a publikus oldalon leadott
ajánlatkéréseket tárolja. Minden táblán RLS érvényesül: a tulajdonos csak a saját
szervezetéhez tartozó adatokat látja/módosíthatja, a nyilvánosság csak a `published` státuszú
projektek adatait olvashatja, és bárki küldhet `leads` bejegyzést egy publikált projekthez.
