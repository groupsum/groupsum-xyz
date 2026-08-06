import React, { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";

interface Token { type: string; value: string }

function rulesFor(language: string): Array<{ type: string; regex: RegExp }> {
  const lang = language.toLowerCase().trim();
  if (lang === "json") return [
    { type: "property", regex: /"[^"\\]*(?:\\.[^"\\]*)*"\s*(?=:)/ },
    { type: "string", regex: /"[^"\\]*(?:\\.[^"\\]*)*"/ },
    { type: "number", regex: /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/ },
    { type: "boolean", regex: /\b(?:true|false)\b/ },
    { type: "null", regex: /\bnull\b/ },
    { type: "punctuation", regex: /[{}[\]:,]/ },
  ];
  const rules: Array<{ type: string; regex: RegExp }> = [];
  if (["python", "bash", "sh", "shell"].includes(lang)) rules.push({ type: "comment", regex: /#.*/ });
  else rules.push({ type: "comment", regex: /\/\*[\s\S]*?\*\// }, { type: "comment", regex: /\/\/.*/ });
  rules.push(
    { type: "string", regex: /"(?:\\.|[^\\"])*"/ },
    { type: "string", regex: /'(?:\\.|[^\\'])*'/ },
    { type: "string", regex: /`(?:\\.|[^\\`])*`/ },
  );
  let keywords = /\b(break|case|catch|class|const|continue|default|delete|do|else|export|extends|finally|for|function|if|import|in|instanceof|new|return|switch|this|throw|try|typeof|var|void|while|yield|let|await|async|type|interface|enum|from|as)\b/;
  if (lang === "python") keywords = /\b(False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|not|or|pass|raise|return|try|while|with|yield)\b/;
  else if (["bash", "sh", "shell"].includes(lang)) keywords = /\b(if|then|elif|else|fi|for|while|in|do|done|case|esac|function|local|return|exit)\b/;
  rules.push(
    { type: "keyword", regex: keywords },
    { type: "function", regex: /\b[a-zA-Z_]\w*(?=\s*\()/ },
    { type: "number", regex: /\b0x[\da-fA-F]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[eE][+-]?\d+)?\b/ },
    { type: "boolean", regex: /\b(?:true|false|True|False|None|nullptr|null)\b/ },
    { type: "punctuation", regex: /[{}[\]()\;.,:]/ },
    { type: "operator", regex: /[+\-*\/%&|^!=<>~?:]+/ },
  );
  return rules;
}

function tokenize(code: string, language: string): Token[] {
  const rules = rulesFor(language);
  const tokens: Token[] = [];
  let index = 0;
  while (index < code.length) {
    const whitespace = /^\s+/.exec(code.slice(index));
    if (whitespace) {
      tokens.push({ type: "text", value: whitespace[0] });
      index += whitespace[0].length;
      continue;
    }
    const rule = rules.find(({ regex }) => new RegExp(`^${regex.source}`, regex.flags).test(code.slice(index)));
    if (!rule) {
      tokens.push({ type: "text", value: code[index++] });
      continue;
    }
    const value = new RegExp(`^${rule.regex.source}`, rule.regex.flags).exec(code.slice(index))?.[0] || code[index];
    tokens.push({ type: rule.type, value });
    index += value.length;
  }
  return tokens;
}

const tokenClass = (type: string) => type === "text" ? "" : `code-token-${type === "null" ? "boolean" : type}`;

export function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);
  const tokens = useMemo(() => tokenize(code, language), [code, language]);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return <div className="relative my-6 rounded-[var(--radius-md)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)] overflow-hidden">
    <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--color-canvas)] border-b border-[var(--color-border-soft)] select-none">
      <span className="text-[11px] font-mono font-bold tracking-wider text-accent uppercase">{language || "code"}</span>
      <button type="button" onClick={handleCopy} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-[10px] font-mono text-ink-muted hover:text-accent cursor-pointer" title="Copy to clipboard">
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}{copied ? "Copied" : "Copy"}
      </button>
    </div>
    <pre className="mdwrk-code-block !m-0 overflow-x-auto overflow-y-hidden font-mono text-xs text-ink leading-relaxed"><code className="mdwrk-code-content !p-0 !m-0 !bg-transparent !border-none !rounded-none !text-inherit">{tokens.map((token, index) => token.type === "text" ? token.value : <span key={index} className={tokenClass(token.type)}>{token.value}</span>)}</code></pre>
  </div>;
}
