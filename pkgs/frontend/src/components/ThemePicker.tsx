import { useEffect, useState } from "react";
import { applyTheme, isTheme, themeLabels, themes, type Theme } from "../design/theme";

export function ThemePicker() {
  const [theme, setTheme] = useState<Theme>("paper");
  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (isTheme(current)) setTheme(current);
    const media = matchMedia("(prefers-color-scheme: dark)");
    const update = () => {
      let saved: string | null = null;
      try { saved = localStorage.getItem("groupsum-theme"); } catch { /* Private browsing. */ }
      if (!isTheme(saved)) {
        const next = media.matches ? "coal" : "paper";
        document.documentElement.dataset.theme = next;
        setTheme(next);
      }
    };
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return <label className="type-control flex shrink-0 items-center gap-1 text-ink-muted">
    <span className="sr-only">Color theme</span>
    <select aria-label="Color theme" value={theme} onChange={(event) => {
      const next = event.target.value;
      if (isTheme(next)) { applyTheme(next); setTheme(next); }
    }} className="theme-picker min-h-8 max-w-28 rounded border border-[var(--color-border-soft)] bg-canvas px-1.5 text-ink">
      {themes.map((value) => <option key={value} value={value}>{themeLabels[value]}</option>)}
    </select>
  </label>;
}
