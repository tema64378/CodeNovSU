"use client";

import { useEffect, useState } from "react";

type Token = { text: string; cls?: string };
type Line = { tokens: Token[] };

const LINES: Line[] = [
  {
    tokens: [
      { text: "fn ", cls: "token-keyword" },
      { text: "fibonacci", cls: "token-fn" },
      { text: "(n: ", cls: "token-punct" },
      { text: "u64", cls: "token-type" },
      { text: ") -> ", cls: "token-punct" },
      { text: "u64", cls: "token-type" },
      { text: " {", cls: "token-punct" },
    ],
  },
  {
    tokens: [
      { text: "    " },
      { text: "match", cls: "token-keyword" },
      { text: " n {", cls: "token-punct" },
    ],
  },
  {
    tokens: [
      { text: "        " },
      { text: "0", cls: "token-number" },
      { text: " | ", cls: "token-punct" },
      { text: "1", cls: "token-number" },
      { text: " => n,", cls: "token-punct" },
    ],
  },
  {
    tokens: [
      { text: "        _ => " },
      { text: "fibonacci", cls: "token-fn" },
      { text: "(n - ", cls: "token-punct" },
      { text: "1", cls: "token-number" },
      { text: ") +", cls: "token-punct" },
    ],
  },
  {
    tokens: [
      { text: "            " },
      { text: "fibonacci", cls: "token-fn" },
      { text: "(n - ", cls: "token-punct" },
      { text: "2", cls: "token-number" },
      { text: ")", cls: "token-punct" },
    ],
  },
  { tokens: [{ text: "    }", cls: "token-punct" }] },
  { tokens: [{ text: "}", cls: "token-punct" }] },
];

// flatten lines to character stream for typing
function flattenLine(line: Line): string {
  return line.tokens.map((t) => t.text).join("");
}

export function CodePreview() {
  const [revealedLines, setRevealedLines] = useState<Line[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    if (currentLineIdx >= LINES.length) {
      setDone(true);
      return;
    }

    const line = LINES[currentLineIdx];
    const full = flattenLine(line);

    if (charCount < full.length) {
      const t = setTimeout(
        () => setCharCount((c) => c + 1),
        28 + Math.random() * 20,
      );
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setRevealedLines((prev) => [...prev, line]);
        setCurrentLineIdx((i) => i + 1);
        setCharCount(0);
      }, 80);
      return () => clearTimeout(t);
    }
  }, [currentLineIdx, charCount, done]);

  // Build partial current line tokens
  const currentLine = LINES[currentLineIdx];
  let partial: Token[] = [];
  if (currentLine && !done) {
    let remaining = charCount;
    for (const token of currentLine.tokens) {
      if (remaining <= 0) break;
      const slice = token.text.slice(0, remaining);
      partial.push({ text: slice, cls: token.cls });
      remaining -= token.text.length;
    }
  }

  return (
    <div className="code-card">
      <div className="code-card__header">
        <div className="code-card__dots">
          <span />
          <span />
          <span />
        </div>
        <span className="code-card__filename">fibonacci.rs</span>
      </div>

      <div className="code-card__body">
        {revealedLines.map((line, i) => (
          <div key={i} className="code-line">
            <span className="code-line__num">{i + 1}</span>
            <span className="code-line__text">
              {line.tokens.map((t, j) =>
                t.cls ? (
                  <span key={j} className={t.cls}>
                    {t.text}
                  </span>
                ) : (
                  t.text
                ),
              )}
            </span>
          </div>
        ))}

        {!done && currentLine && (
          <div className="code-line">
            <span className="code-line__num">{revealedLines.length + 1}</span>
            <span className="code-line__text">
              {partial.map((t, j) =>
                t.cls ? (
                  <span key={j} className={t.cls}>
                    {t.text}
                  </span>
                ) : (
                  t.text
                ),
              )}
              <span className="cursor-blink" />
            </span>
          </div>
        )}
      </div>

      {done && (
        <div className="code-card__output">
          <div className="code-card__output-label">Вывод</div>
          <div>fibonacci(10) = 55</div>
          <div>fibonacci(20) = 6765</div>
        </div>
      )}
    </div>
  );
}
