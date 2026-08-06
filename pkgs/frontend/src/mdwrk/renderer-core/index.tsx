/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from "react";
import { CodeBlock } from "./CodeBlock";
import { parseInlineMarkdown } from "./InlineMarkdown";

export { CodeBlock } from "./CodeBlock";

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
