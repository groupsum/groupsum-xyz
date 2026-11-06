export const themes = ["paper", "coal", "mist", "midnight", "parchment", "evergreen"] as const;
export type Theme = typeof themes[number];
export const themeLabels: Record<Theme, string> = {
  paper: "Paper", coal: "Coal", mist: "Mist", midnight: "Midnight", parchment: "Parchment", evergreen: "Evergreen",
};
export function isTheme(value: unknown): value is Theme {
  return themes.includes(value as Theme);
}
export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem("groupsum-theme", theme); } catch { /* Storage may be disabled. */ }
}
