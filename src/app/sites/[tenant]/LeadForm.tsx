"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type UnitOption = { id: string; unit_number: string };

export function LeadForm({
  projectId,
  units,
  preselectedUnitId,
}: {
  projectId: string;
  units: UnitOption[];
  preselectedUnitId?: string | null;
}) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      project_id: projectId,
      unit_id: String(formData.get("unit_id") || "") || null,
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim() || null,
      message: String(formData.get("message") || "").trim() || null,
    };

    if (!payload.name || !payload.email) {
      setError("Add meg a neved és az e-mail-címed.");
      setBusy(false);
      return;
    }

    const supabase = createClient();
    const { error: insertError } = await supabase.from("leads").insert(payload);

    setBusy(false);
    if (insertError) {
      setError("Hiba történt, próbáld újra.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <p className="rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        Köszönjük az érdeklődést! Hamarosan felvesszük veled a kapcsolatot.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {units.length > 0 ? (
        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          Érintett lakás (opcionális)
          <select
            name="unit_id"
            defaultValue={preselectedUnitId ?? ""}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          >
            <option value="">— nincs kiválasztva —</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.unit_number}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <label className="flex flex-col gap-1 text-sm text-zinc-700">
        Név
        <input name="name" required className="rounded-md border border-zinc-300 px-3 py-2 text-sm" />
      </label>
      <label className="flex flex-col gap-1 text-sm text-zinc-700">
        E-mail
        <input
          name="email"
          type="email"
          required
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-zinc-700">
        Telefon
        <input name="phone" className="rounded-md border border-zinc-300 px-3 py-2 text-sm" />
      </label>
      <label className="flex flex-col gap-1 text-sm text-zinc-700">
        Üzenet
        <textarea name="message" rows={3} className="rounded-md border border-zinc-300 px-3 py-2 text-sm" />
      </label>
      <button
        type="submit"
        disabled={busy}
        className="mt-1 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
      >
        {busy ? "Küldés..." : "Ajánlatkérés"}
      </button>
    </form>
  );
}
