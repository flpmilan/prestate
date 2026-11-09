"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ProjectStatus } from "@/lib/types";
import { setProjectStatus } from "./actions";

export function PublishToggle({
  projectId,
  status,
}: {
  projectId: string;
  status: ProjectStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const nextStatus: ProjectStatus = status === "published" ? "draft" : "published";

  return (
    <div className="flex items-center gap-2">
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
      <button
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            try {
              await setProjectStatus(projectId, nextStatus);
              router.refresh();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Hiba történt.");
            }
          })
        }
        className={`rounded-md px-4 py-2 text-sm font-medium ${
          status === "published"
            ? "border border-zinc-300 text-zinc-700 hover:bg-zinc-50"
            : "bg-emerald-600 text-white hover:bg-emerald-500"
        }`}
      >
        {pending ? "..." : status === "published" ? "Vissza vázlatba" : "Publikálás"}
      </button>
    </div>
  );
}
