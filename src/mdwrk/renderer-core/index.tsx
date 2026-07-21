/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

/**
 * A robust and resilient Markdown renderer designed for mdwrk/renderer-core.
 * It parses markdown structures (headings, lists, code blocks, tables, math, quotes)
 * and outputs styled React elements optimized for the "Professional Polish" design theme.
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const renderedElements = useMemo(() => {
    if (!content) return null;

    // Split content into lines to parse line-by-line or block-by-block
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let currentBlock: "paragraph" | "list-unordered" | "list-ordered" | "code" | "table" | "blockquote" | null = null;
    let codeLanguage = "";
    let codeLines: string[] = [];
    let listItems: string[] = [];
    let tableRows: string[][] = [];
    let quoteLines: string[] = [];
    let paragraphLines: string[] = [];

    const flushParagraph = (key: string) => {
      if (paragraphLines.length > 0) {
        const text = paragraphLines.join("\n").trim();
        if (text) {
          elements.push(
            <p key={`p-${key}`} className="text-sm leading-relaxed text-ink-muted mb-4">
              {parseInlineMarkdown(text)}
            </p>
          );
        }
        paragraphLines = [];
      }
    };

    const flushBlock = (key: string) => {
      if (!currentBlock) return;

      if (currentBlock === "paragraph") {
        flushParagraph(key);
      } else if (currentBlock === "code") {
        const codeText = codeLines.join("\n");
        elements.push(
          <CodeBlock key={`code-${key}`} code={codeText} language={codeLanguage} />
        );
        codeLines = [];
        codeLanguage = "";
      } else if (currentBlock === "list-unordered") {
        elements.push(
          <ul key={`ul-${key}`} className="list-disc pl-6 space-y-2 mb-4 text-sm text-ink-muted">
            {listItems.map((item, i) => (
              <li key={i}>{parseInlineMarkdown(item)}</li>
            ))}
          </ul>
        );
        listItems = [];
      } else if (currentBlock === "list-ordered") {
        elements.push(
          <ol key={`ol-${key}`} className="list-decimal pl-6 space-y-2 mb-4 text-sm text-ink-muted">
            {listItems.map((item, i) => (
              <li key={i}>{parseInlineMarkdown(item)}</li>
            ))}
          </ol>
        );
        listItems = [];
      } else if (currentBlock === "blockquote") {
        elements.push(
          <blockquote key={`quote-${key}`} className="border-l-3 border-accent bg-[var(--color-surface)] p-4 my-6 rounded-r-[var(--radius-sm)] italic text-sm text-ink-muted">
            {parseInlineMarkdown(quoteLines.join("\n"))}
          </blockquote>
        );
        quoteLines = [];
      } else if (currentBlock === "table") {
        // Filter out divider row (contains only dashes, colons, pipes)
        const activeRows = tableRows.filter((row) => {
          const joined = row.join("").trim();
          return !(/^[:\-\s|]+$/g.test(joined));
        });

        if (activeRows.length > 0) {
          const hasHeaders = tableRows.length > 1; // standard md has a header and divider
          const headers = activeRows[0];
          const dataRows = activeRows.slice(1);

          elements.push(
            <div key={`table-${key}`} className="my-6 overflow-x-auto border border-[var(--color-border-soft)] rounded-[var(--radius-md)] shadow-[var(--shadow-soft)] bg-[var(--color-surface)]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[var(--color-canvas)] border-b border-[var(--color-border-muted)]">
                    {headers.map((col, i) => (
                      <th key={i} className="p-3 font-semibold text-ink uppercase tracking-wider">
                        {parseInlineMarkdown(col.trim())}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-soft)]">
                  {dataRows.map((row, rIndex) => (
                    <tr key={rIndex} className="hover:bg-[var(--color-canvas)]/30 transition-colors">
                      {row.map((col, cIndex) => (
                        <td key={cIndex} className="p-3 text-ink-muted leading-relaxed">
                          {parseInlineMarkdown(col.trim())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        tableRows = [];
      }

      currentBlock = null;
    };

    let lineIndex = 0;
    while (lineIndex < lines.length) {
      const line = lines[lineIndex];
      const trimmed = line.trim();

      // Code Block Start/End
      if (trimmed.startsWith("```")) {
        if (currentBlock === "code") {
          flushBlock(`${lineIndex}`);
        } else {
          flushBlock(`${lineIndex}`);
          currentBlock = "code";
          codeLanguage = trimmed.slice(3).trim();
        }
        lineIndex++;
        continue;
      }

      // If inside code block, append lines
      if (currentBlock === "code") {
        codeLines.push(line);
        lineIndex++;
        continue;
      }

      // Headers
      if (trimmed.startsWith("#")) {
        flushBlock(`${lineIndex}`);
        const match = trimmed.match(/^(#{1,6})\s+(.*)$/);
        if (match) {
          const level = match[1].length;
          const text = match[2];
          
          if (level === 1) {
            elements.push(
              <h1 key={lineIndex} className="font-serif text-3xl sm:text-4.5xl font-bold tracking-tight text-ink mt-8 mb-4 leading-tight">
                {parseInlineMarkdown(text)}
              </h1>
            );
          } else if (level === 2) {
            elements.push(
              <h2 key={lineIndex} className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-ink mt-8 mb-4 border-b border-[var(--color-border-soft)] pb-2 leading-tight">
                {parseInlineMarkdown(text)}
              </h2>
            );
          } else if (level === 3) {
            elements.push(
              <h3 key={lineIndex} className="font-serif text-lg sm:text-xl font-semibold tracking-tight text-ink mt-6 mb-3 leading-snug">
                {parseInlineMarkdown(text)}
              </h3>
            );
          } else {
            elements.push(
              <h4 key={lineIndex} className="font-sans text-sm font-bold uppercase tracking-widest text-accent mt-6 mb-2">
                {parseInlineMarkdown(text)}
              </h4>
            );
          }
        }
        lineIndex++;
        continue;
      }

      // Unordered Lists
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ")) {
        if (currentBlock !== "list-unordered") {
          flushBlock(`${lineIndex}`);
          currentBlock = "list-unordered";
        }
        listItems.push(trimmed.slice(2));
        lineIndex++;
        continue;
      }

      // Ordered Lists
      if (/^\d+\.\s+/.test(trimmed)) {
        if (currentBlock !== "list-ordered") {
          flushBlock(`${lineIndex}`);
          currentBlock = "list-ordered";
        }
        const itemContent = trimmed.replace(/^\d+\.\s+/, "");
        listItems.push(itemContent);
        lineIndex++;
        continue;
      }

      // Blockquotes
      if (trimmed.startsWith(">")) {
        if (currentBlock !== "blockquote") {
          flushBlock(`${lineIndex}`);
          currentBlock = "blockquote";
        }
        quoteLines.push(trimmed.slice(1).trim());
        lineIndex++;
        continue;
      }

      // Tables (must start/end or contain pipe separators)
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        if (currentBlock !== "table") {
          flushBlock(`${lineIndex}`);
          currentBlock = "table";
        }
        const cells = trimmed
          .split("|")
          .map((c) => c.trim())
          .filter((_, i, arr) => i > 0 && i < arr.length - 1); // strip leading/trailing empty cells
        tableRows.push(cells);
        lineIndex++;
        continue;
      }

      // Divider Lines
      if (trimmed === "---" || trimmed === "___" || trimmed === "***") {
        flushBlock(`${lineIndex}`);
        elements.push(<hr key={lineIndex} className="my-8 border-t border-[var(--color-border-muted)] opacity-60" />);
        lineIndex++;
        continue;
      }

      // Math Equations (Block Form)
      if (trimmed.startsWith("$$") && trimmed.endsWith("$$")) {
        flushBlock(`${lineIndex}`);
        const mathContent = trimmed.slice(2, -2).trim();
        elements.push(
          <div key={lineIndex} className="my-6 p-4 rounded-[var(--radius-sm)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] flex items-center justify-center font-mono text-xs overflow-x-auto">
            {mathContent}
          </div>
        );
        lineIndex++;
        continue;
      }

      // Blank line
      if (trimmed === "") {
        if (currentBlock === "paragraph") {
          flushBlock(`${lineIndex}`);
        }
        lineIndex++;
        continue;
      }

      // Regular paragraph text line
      if (!currentBlock) {
        currentBlock = "paragraph";
      }
      paragraphLines.push(line);
      lineIndex++;
    }

    // Flush any remaining blocks
    flushBlock("final");

    return elements;
  }, [content]);

  return <div className="markdown-body mdwrk-renderer space-y-4">{renderedElements}</div>;
}

/**
 * Parses inline elements of Markdown (bold, italic, code, links, math, highlights)
 */
function parseInlineMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];

  // Match bold, italic, code, math, links
  // We use regex execution loops to preserve structure
  const regex = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3|(`)(.*?)\5|(\$\$?)(.*?)\7|(\[)(.*?)\]\((.*?)\)/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  let keyId = 0;

  while ((match = regex.exec(text)) !== null) {
    // Add text preceding the match
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }

    // Destructure match
    // match[1] = bold wrapper, match[2] = bold text
    // match[3] = italic wrapper, match[4] = italic text
    // match[5] = code wrapper, match[6] = code text
    // match[7] = math wrapper, match[8] = math text
    // match[9] = link bracket, match[10] = link label, match[11] = link URL
    if (match[1]) {
      // Bold
      elements.push(<strong key={keyId++} className="font-bold text-ink">{match[2]}</strong>);
    } else if (match[3]) {
      // Italic
      elements.push(<em key={keyId++} className="italic opacity-90">{match[4]}</em>);
    } else if (match[5]) {
      // Code
      elements.push(<code key={keyId++} className="px-1.5 py-0.5 bg-[var(--color-canvas)] border border-[var(--color-border-soft)] font-mono text-xs text-accent rounded-sm">{match[6]}</code>);
    } else if (match[7]) {
      // Math
      elements.push(<span key={keyId++} className="font-mono text-[11px] bg-[var(--color-surface)] border border-[var(--color-border-soft)] px-1 py-0.5 rounded-sm mx-0.5 text-ink-muted select-all">{match[8]}</span>);
    } else if (match[9]) {
      // Link
      const label = match[10];
      const url = match[11];
      const isExternal = url.startsWith("http");
      elements.push(
        <a
          key={keyId++}
          href={url}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-accent hover:text-accent-hover font-semibold underline underline-offset-2 transition-colors inline-flex items-center gap-0.5"
        >
          {label}
        </a>
      );
    }

    lastIndex = regex.lastIndex;
  }

  // Add trailing text
  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements.length > 0 ? elements : [text];
}

interface Token {
  type: string;
  value: string;
}

function tokenize(code: string, language: string): Token[] {
  const lang = language.toLowerCase().trim();
  const rules: { type: string; regex: RegExp }[] = [];

  if (lang === "json") {
    rules.push(
      { type: "property", regex: /"[^"\\]*(?:\\.[^"\\]*)*"\s*(?=:)/ },
      { type: "string", regex: /"[^"\\]*(?:\\.[^"\\]*)*"/ },
      { type: "number", regex: /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/ },
      { type: "boolean", regex: /\b(?:true|false)\b/ },
      { type: "null", regex: /\bnull\b/ },
      { type: "punctuation", regex: /[{}[\]:,]/ }
    );
  } else {
    // Comments
    if (lang === "python" || lang === "bash" || lang === "sh" || lang === "shell") {
      rules.push({ type: "comment", regex: /#.*/ });
    } else {
      rules.push(
        { type: "comment", regex: /\/\*[\s\S]*?\*\// },
        { type: "comment", regex: /\/\/.*/ }
      );
    }

    // Strings
    rules.push(
      { type: "string", regex: /"(?:\\.|[^\\"])*"/ },
      { type: "string", regex: /'(?:\\.|[^\\'])*'/ },
      { type: "string", regex: /`(?:\\.|[^\\`])*`/ }
    );

    // Keywords
    let keywordsRegex = /\b(break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|finally|for|function|if|import|in|instanceof|new|return|super|switch|this|throw|try|typeof|var|void|while|with|yield|let|package|private|protected|public|static|await|async|type|interface|enum|from|as)\b/;
    if (lang === "python") {
      keywordsRegex = /\b(False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b/;
    } else if (lang === "cpp" || lang === "c") {
      keywordsRegex = /\b(alignas|alignof|and|and_eq|asm|atomic_cancel|atomic_commit|atomic_noexcept|auto|bitand|bitor|bool|break|case|catch|char|char8_t|char16_t|char32_t|class|compl|concept|const|consteval|constexpr|constinit|const_cast|continue|co_await|co_return|co_yield|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|false|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|noexcept|not|not_eq|nullptr|operator|or|or_eq|private|protected|public|reflexpr|register|reinterpret_cast|requires|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|synchronized|template|this|thread_local|throw|true|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while|xor|xor_eq)\b/;
    } else if (lang === "bash" || lang === "sh" || lang === "shell") {
      keywordsRegex = /\b(if|then|elif|else|fi|for|while|in|do|done|case|esac|function|local|return|exit)\b/;
    }
    rules.push({ type: "keyword", regex: keywordsRegex });

    // Builtins / Types / Preprocessor
    if (lang === "cpp" || lang === "c") {
      rules.push({ type: "preprocessor", regex: /#\s*(include|define|undef|ifdef|ifndef|if|else|elif|endif|error|pragma)/ });
    }

    // Functions
    rules.push({ type: "function", regex: /\b[a-zA-Z_]\w*(?=\s*\()/ });

    // Numbers
    rules.push({ type: "number", regex: /\b0x[\da-fA-F]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[eE][+-]?\d+)?\b/ });

    // Booleans
    rules.push({ type: "boolean", regex: /\b(?:true|false|True|False|None|nullptr|null)\b/ });

    // Punctuation & Operators
    rules.push({ type: "punctuation", regex: /[{}[\]()\;.,:]/ });
    rules.push({ type: "operator", regex: /[+\-*\/%&|^!=<>~?:]+/ });
  }

  const tokens: Token[] = [];
  let index = 0;

  while (index < code.length) {
    const wsMatch = /^\s+/.exec(code.slice(index));
    if (wsMatch) {
      tokens.push({ type: "text", value: wsMatch[0] });
      index += wsMatch[0].length;
      continue;
    }

    let matched = false;
    for (const rule of rules) {
      const pattern = new RegExp("^" + rule.regex.source, rule.regex.flags);
      const match = pattern.exec(code.slice(index));
      if (match) {
        tokens.push({ type: rule.type, value: match[0] });
        index += match[0].length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      tokens.push({ type: "text", value: code[index] });
      index += 1;
    }
  }

  return tokens;
}

interface CodeBlockProps {
  code: string;
  language: string;
  key?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  const tokens = useMemo(() => {
    return tokenize(code, language);
  }, [code, language]);

  return (
    <div className="relative my-6 rounded-[var(--radius-md)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)] overflow-hidden transition-all duration-200 hover:shadow-hover">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--color-canvas)] border-b border-[var(--color-border-soft)] select-none">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-accent/20 border border-accent/40"></span>
          <span className="text-[11px] font-mono font-bold tracking-wider text-accent uppercase">
            {language || "code"}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-mono text-ink-muted hover:text-accent hover:bg-accent/5 transition-all active:scale-95 cursor-pointer"
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-accent" />
              <span className="text-accent font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="mdwrk-code-block !m-0 overflow-x-auto overflow-y-hidden font-mono text-xs text-ink leading-relaxed">
        <code className="mdwrk-code-content !p-0 !m-0 !bg-transparent !border-none !rounded-none !text-inherit">
          {tokens.map((token, i) => {
            if (token.type === "text") {
              return token.value;
            }
            let className = "";
            if (token.type === "comment") {
              className = "code-token-comment";
            } else if (token.type === "string") {
              className = "code-token-string";
            } else if (token.type === "keyword") {
              className = "code-token-keyword";
            } else if (token.type === "property") {
              className = "code-token-property";
            } else if (token.type === "function") {
              className = "code-token-function";
            } else if (token.type === "preprocessor") {
              className = "code-token-preprocessor";
            } else if (token.type === "number") {
              className = "code-token-number";
            } else if (token.type === "boolean" || token.type === "null") {
              className = "code-token-boolean";
            } else if (token.type === "operator") {
              className = "code-token-operator";
            } else if (token.type === "punctuation") {
              className = "code-token-punctuation";
            }
            return (
              <span key={i} className={className}>
                {token.value}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
