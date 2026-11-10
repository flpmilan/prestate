"use client";

import Link from "next/link";
import { useState } from "react";
import type { ProjectBlock } from "@/lib/types";

const BLOCK_LABELS: Record<string, string> = {
  hero: "Hero (nyitó szekció)",
  building_explorer: "Épület böngésző",
  unit_list: "Lakáslista",
  location: "Helyszín térkép",
  offer: "Ajánlatkérés",
  text: "Egyedi szöveges szekció",
};

type Tab = "ai" | "sections" | "appearance";

export function EditorClient({
  projectId,
  projectName,
  initialBlocks,
  initialAccentColor,
}: {
  projectId: string;
  projectName: string;
  initialBlocks: ProjectBlock[];
  initialAccentColor: string | null;
}) {
  const [tab, setTab] = useState<Tab>("ai");
  const [blocks, setBlocks] = useState<ProjectBlock[]>(initialBlocks);
  const [accentColor, setAccentColorState] = useState<string | null>(initialAccentColor);
  const [reloadToken, setReloadToken] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [instruction, setInstruction] = useState("");
  const [lastApplied, setLastApplied] = useState<string[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  async function refresh() {
    const res = await fetch(`/api/project-blocks?projectId=${projectId}`);
    const json = await res.json();
    if (res.ok) setBlocks(json.blocks ?? []);
    setReloadToken((t) => t + 1);
  }

  async function callAction(action: string, payload: Record<string, unknown>) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/project-blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, action, ...payload }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Hiba történt.");
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hiba történt.");
    } finally {
      setBusy(false);
    }
  }

  async function submitInstruction() {
    if (!instruction.trim()) return;
    setBusy(true);
    setError(null);
    setLastApplied([]);
    try {
      const res = await fetch("/api/editor/ai-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, instruction }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Hiba történt.");
      setBlocks(json.blocks ?? []);
      setAccentColorState(json.accentColor ?? null);
      setLastApplied(json.applied ?? []);
      if (json.errors?.length) setError(json.errors.join(" "));
      setInstruction("");
      setReloadToken((t) => t + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hiba történt.");
    } finally {
      setBusy(false);
    }
  }

  const sorted = [...blocks].sort((a, b) => a.position - b.position);

  return (
    <div className="flex h-screen flex-col bg-zinc-50">
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-3">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/projects/${projectId}`} className="text-sm text-zinc-500 hover:text-zinc-900">
            ← Vissza
          </Link>
          <span className="text-sm font-medium text-zinc-900">Élő szerkesztő · {projectName}</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <iframe
          key={reloadToken}
          src={`/preview/${projectId}`}
          className="h-full flex-1 border-0"
          title="Oldal előnézet"
        />

        <div className="flex w-[380px] shrink-0 flex-col border-l border-zinc-200 bg-white">
          <div className="flex border-b border-zinc-200 text-sm">
            <button
              type="button"
              onClick={() => setTab("ai")}
              className={`flex-1 px-3 py-2.5 font-medium ${tab === "ai" ? "border-b-2 border-zinc-900 text-zinc-900" : "text-zinc-500"}`}
            >
              AI chat
            </button>
            <button
              type="button"
              onClick={() => setTab("sections")}
              className={`flex-1 px-3 py-2.5 font-medium ${tab === "sections" ? "border-b-2 border-zinc-900 text-zinc-900" : "text-zinc-500"}`}
            >
              Szekciók
            </button>
            <button
              type="button"
              onClick={() => setTab("appearance")}
              className={`flex-1 px-3 py-2.5 font-medium ${tab === "appearance" ? "border-b-2 border-zinc-900 text-zinc-900" : "text-zinc-500"}`}
            >
              Megjelenés
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {error ? <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p> : null}

            {tab === "ai" ? (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-zinc-500">
                  Írd le, mit változtassunk (pl. &quot;adj hozzá egy szekciót a környékről&quot;, &quot;legyen
                  kékes a kiemelő szín&quot;).
                </p>
                <textarea
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  rows={4}
                  placeholder="Mit változtassunk?"
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                />
                <button
                  type="button"
                  disabled={busy}
                  onClick={submitInstruction}
                  className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
                >
                  {busy ? "Dolgozom rajta..." : "Küldés"}
                </button>
                {lastApplied.length > 0 ? (
                  <ul className="mt-1 flex flex-col gap-1 text-xs text-emerald-700">
                    {lastApplied.map((line, i) => (
                      <li key={i}>✓ {line}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}

            {tab === "sections" ? (
              <div className="flex flex-col gap-3">
                {sorted.map((block, i) => (
                  <div key={block.id} className="rounded-md border border-zinc-200 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-zinc-900">
                        {BLOCK_LABELS[block.type] ?? block.type}
                        {block.type === "text" && block.title ? ` — ${block.title}` : ""}
                      </span>
                      {!block.visible ? <span className="text-[10px] text-zinc-400">elrejtve</span> : null}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={busy || i === 0}
                        onClick={() => callAction("move", { id: block.id, direction: "up" })}
                        className="rounded border border-zinc-300 px-2 py-1 text-xs text-zinc-600 disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        disabled={busy || i === sorted.length - 1}
                        onClick={() => callAction("move", { id: block.id, direction: "down" })}
                        className="rounded border border-zinc-300 px-2 py-1 text-xs text-zinc-600 disabled:opacity-30"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => callAction("visible", { id: block.id, visible: !block.visible })}
                        className="rounded border border-zinc-300 px-2 py-1 text-xs text-zinc-600"
                      >
                        {block.visible ? "Elrejtés" : "Megjelenítés"}
                      </button>
                      {block.type === "text" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(block.id);
                              setEditTitle(block.title ?? "");
                              setEditBody(block.body ?? "");
                            }}
                            className="rounded border border-zinc-300 px-2 py-1 text-xs text-zinc-600"
                          >
                            Szerkesztés
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => callAction("delete", { id: block.id })}
                            className="rounded border border-red-200 px-2 py-1 text-xs text-red-600"
                          >
                            Törlés
                          </button>
                        </>
                      ) : null}
                    </div>

                    {editingId === block.id ? (
                      <div className="mt-2 flex flex-col gap-2">
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Cím"
                          className="rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
                        />
                        <textarea
                          value={editBody}
                          onChange={(e) => setEditBody(e.target.value)}
                          rows={3}
                          placeholder="Szöveg"
                          className="rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={async () => {
                              await callAction("update_text", { id: block.id, title: editTitle, body: editBody });
                              setEditingId(null);
                            }}
                            className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white"
                          >
                            Mentés
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs text-zinc-600"
                          >
                            Mégse
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}

                <div className="mt-2 rounded-md border border-dashed border-zinc-300 p-3">
                  <p className="text-xs font-medium text-zinc-700">Új szöveges szekció</p>
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Cím"
                    className="mt-2 w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
                  />
                  <textarea
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    rows={3}
                    placeholder="Szöveg"
                    className="mt-2 w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
                  />
                  <button
                    type="button"
                    disabled={busy || !newTitle.trim()}
                    onClick={async () => {
                      await callAction("add_text", { title: newTitle, body: newBody });
                      setNewTitle("");
                      setNewBody("");
                    }}
                    className="mt-2 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                  >
                    Hozzáadás
                  </button>
                </div>
              </div>
            ) : null}

            {tab === "appearance" ? (
              <div className="flex flex-col gap-3">
                <label className="flex flex-col gap-1 text-sm text-zinc-700">
                  Kiemelő szín (accent)
                  <input
                    type="color"
                    value={accentColor ?? "#000000"}
                    onChange={(e) => setAccentColorState(e.target.value)}
                    className="h-10 w-20 rounded border border-zinc-300"
                  />
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={busy || !accentColor}
                    onClick={() => callAction("set_accent", { accent: accentColor })}
                    className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                  >
                    Mentés
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={async () => {
                      await callAction("set_accent", { accent: null });
                      setAccentColorState(null);
                    }}
                    className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs text-zinc-600"
                  >
                    Alapértelmezett visszaállítása
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
