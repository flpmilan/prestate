"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import type { UnitStatus } from "@/lib/types";

const OPTIONS: { value: UnitStatus; label: string }[] = [
  { value: "available", label: "Szabad" },
  { value: "reserved", label: "Fenntartott" },
  { value: "sold", label: "Eladva" },
];

export function UnitStatusSelect({ unitId, status }: { unitId: string; status: UnitStatus }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState(status);

  return (
    <select
      value={value}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as UnitStatus;
        setValue(next);
        startTransition(async () => {
          const supabase = createClient();
          await supabase.from("units").update({ status: next }).eq("id", unitId);
          router.refresh();
        });
      }}
      className="rounded-md border border-[#E3DCCB] bg-white px-2 py-1 text-xs text-[#1C1A17]"
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
