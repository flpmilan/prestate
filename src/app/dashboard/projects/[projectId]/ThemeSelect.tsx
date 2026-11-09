"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ProjectTheme } from "@/lib/types";
import { setProjectTheme } from "./actions";

const OPTIONS: { value: ProjectTheme; label: string; swatch: string }[] = [
  { value: "warm", label: "Meleg szerkesztői luxus", swatch: "bg-[#BD6B43]" },
  { value: "dark", label: "Sötét, drámai", swatch: "bg-[#16120E]" },
  { value: "minimal", label: "Letisztult modern minimál", swatch: "bg-zinc-900" },
];

export function ThemeSelect({ projectId, theme }: { projectId: string; theme: ProjectTheme }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState(theme);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            disabled={pending}
            onClick={() => {
              if (opt.value === value) return;
              setValue(opt.value);
              startTransition(async () => {
                setError(null);
                try {
                  await setProjectTheme(projectId, opt.value);
                  router.refresh();
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Hiba történt.");
                }
              });
            }}
            className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium ${
              value === opt.value
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${opt.swatch}`} />
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
