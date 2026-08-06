import React from "react";

export function parseInlineMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];
  const regex = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3|(`)(.*?)\5|(\$\$?)(.*?)\7|(\[)(.*?)\]\((.*?)\)/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let keyId = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) elements.push(text.slice(lastIndex, match.index));
    if (match[1]) elements.push(<strong key={keyId++} className="font-bold text-ink">{match[2]}</strong>);
    else if (match[3]) elements.push(<em key={keyId++} className="italic opacity-90">{match[4]}</em>);
    else if (match[5]) elements.push(<code key={keyId++} className="px-1.5 py-0.5 bg-[var(--color-canvas)] border border-[var(--color-border-soft)] font-mono text-xs text-accent rounded-sm">{match[6]}</code>);
    else if (match[7]) elements.push(<span key={keyId++} className="font-mono text-[11px] bg-[var(--color-surface)] border border-[var(--color-border-soft)] px-1 py-0.5 rounded-sm mx-0.5 text-ink-muted select-all">{match[8]}</span>);
    else if (match[9]) {
      const url = match[11];
      const external = url.startsWith("http");
      elements.push(<a key={keyId++} href={url} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className="text-accent hover:text-accent-hover font-semibold underline underline-offset-2 transition-colors inline-flex items-center gap-0.5">{match[10]}</a>);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) elements.push(text.slice(lastIndex));
  return elements.length > 0 ? elements : [text];
}
