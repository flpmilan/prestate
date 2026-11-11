// Shared visual language for the Prestate SaaS shell (marketing + dashboard).
// Not used by the public tenant sites, which have their own per-project themes.

export const ui = {
  page: "min-h-full bg-[#FAF7F2]",
  header: "border-b border-[#E8E1D4] bg-[#FDFBF8]",
  card: "rounded-xl border border-[#E8E1D4] bg-white",
  cardMuted: "rounded-xl border border-[#E8E1D4] bg-[#FBF8F3]",
  sectionLabel: "text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9C5636]",
  heading: "text-xl font-semibold text-[#1C1A17]",
  subtext: "text-sm text-[#6B6354]",

  input:
    "rounded-md border border-[#E3DCCB] bg-white px-3 py-2 text-sm text-[#1C1A17] outline-none placeholder:text-[#B2A990] focus:border-[#9C5636] focus:ring-2 focus:ring-[#9C5636]/15",

  buttonPrimary:
    "inline-flex items-center justify-center gap-1.5 rounded-md bg-[#1C1A17] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2E2A24] disabled:opacity-50",
  buttonAccent:
    "inline-flex items-center justify-center gap-1.5 rounded-md bg-[#9C5636] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#86472C] disabled:opacity-50",
  buttonSecondary:
    "inline-flex items-center justify-center gap-1.5 rounded-md border border-[#E3DCCB] bg-white px-4 py-2 text-sm font-medium text-[#1C1A17] transition-colors hover:bg-[#F3EFE7] disabled:opacity-50",
  buttonGhost:
    "inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-[#6B6354] transition-colors hover:bg-[#F3EFE7] hover:text-[#1C1A17] disabled:opacity-50",
  buttonDanger:
    "inline-flex items-center justify-center gap-1.5 rounded-md border border-[#E7B9A6] bg-white px-3 py-1.5 text-xs font-medium text-[#A8402A] transition-colors hover:bg-[#FBF0EC] disabled:opacity-50",

  link: "text-sm font-medium text-[#9C5636] hover:text-[#86472C]",
  linkMuted: "text-sm text-[#6B6354] hover:text-[#1C1A17]",

  errorBanner: "rounded-md bg-[#FBEAE3] px-3 py-2 text-sm text-[#A8402A]",
} as const;

export function badgeClass(tone: "neutral" | "success" | "warning" | "accent"): string {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  const tones: Record<typeof tone, string> = {
    neutral: "bg-[#F1EDE4] text-[#6B6354]",
    success: "bg-[#E6EFE4] text-[#3D6B3A]",
    warning: "bg-[#F6E9D2] text-[#8A6417]",
    accent: "bg-[#F3E3D8] text-[#9C5636]",
  };
  return `${base} ${tones[tone]}`;
}
