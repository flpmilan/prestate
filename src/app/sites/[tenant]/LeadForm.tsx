"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type UnitOption = { id: string; unit_number: string };
type Variant = "warm" | "dark" | "minimal";

const VARIANT_STYLES: Record<
  Variant,
  {
    label: string;
    field: string;
    button: string;
    success: string;
    error: string;
  }
> = {
  warm: {
    label: "text-sm text-[#BDB2A1]",
    field:
      "rounded-[2px] border border-[#4A443B] bg-[#35302A] px-4 py-3.5 text-[15px] text-[#FBF7F1] placeholder:text-[#8A7E6E]",
    button:
      "self-start rounded-[2px] bg-[#BD6B43] px-7 py-4 text-[15px] font-semibold text-[#2A2420] hover:bg-[#C97B55]",
    success: "rounded-[2px] bg-[#2F3A27] px-4 py-3 text-sm text-[#CDE0C0]",
    error: "text-sm text-[#E8A98A]",
  },
  dark: {
    label: "text-xs uppercase tracking-wide text-[#786B57]",
    field:
      "rounded-none border border-[#3A3226] bg-[#16120E] px-4 py-3.5 text-[15px] text-[#F2EAE0] placeholder:text-[#5C543F]",
    button:
      "self-start rounded-none bg-[#C9A063] px-7 py-4 text-sm font-semibold tracking-wide text-[#16120E] hover:bg-[#D7AD72]",
    success: "rounded-none border border-[#5C7257] px-4 py-3 text-sm text-[#9BBE8E]",
    error: "text-sm text-[#D08A6E]",
  },
  minimal: {
    label: "text-xs text-[#8A8A86]",
    field:
      "border-0 border-b border-[#E8E8E6] bg-transparent px-0 pb-3 text-base text-[#131313] placeholder:text-[#B5B5B0] focus:border-[#131313] focus:outline-none",
    button: "self-start bg-[#131313] px-7 py-4 text-sm font-medium text-white hover:bg-[#2A2A2A]",
    success: "border border-[#E8E8E6] px-4 py-3 text-sm text-[#131313]",
    error: "text-sm text-[#8A5A3B]",
  },
};

export function LeadForm({
  projectId,
  units,
  variant = "warm",
  preselectedUnitId,
}: {
  projectId: string;
  units: UnitOption[];
  variant?: Variant;
  preselectedUnitId?: string | null;
}) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const s = VARIANT_STYLES[variant];

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
      <p className={s.success}>Köszönjük az érdeklődést! Hamarosan felvesszük veled a kapcsolatot.</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error ? <p className={s.error}>{error}</p> : null}
      {units.length > 0 ? (
        <label className={`flex flex-col gap-2 ${s.label}`}>
          Érintett lakás (opcionális)
          <select name="unit_id" defaultValue={preselectedUnitId ?? ""} className={s.field}>
            <option value="">— nincs kiválasztva —</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.unit_number}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <label className={`flex flex-col gap-2 ${s.label}`}>
        Név
        <input name="name" required placeholder="Teljes név" className={s.field} />
      </label>
      <label className={`flex flex-col gap-2 ${s.label}`}>
        E-mail
        <input name="email" type="email" required placeholder="nev@example.com" className={s.field} />
      </label>
      <label className={`flex flex-col gap-2 ${s.label}`}>
        Telefon
        <input name="phone" type="tel" placeholder="+36 30 123 4567" className={s.field} />
      </label>
      <label className={`flex flex-col gap-2 ${s.label}`}>
        Üzenet
        <textarea name="message" rows={3} className={s.field} />
      </label>
      <button type="submit" disabled={busy} className={s.button}>
        {busy ? "Küldés..." : "Ajánlatkérés küldése"}
      </button>
    </form>
  );
}
