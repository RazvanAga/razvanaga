"use client";

import { useRef, useEffect, useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";

export default function Terminal() {
  const { terminalHistory, currentDir, runCommand } = usePortfolio();
  const [inputValue, setInputValue] = useState("");
  const historyEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom whenever history updates
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    runCommand(inputValue);
    setInputValue("");
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const prompt = `${currentDir} >`;

  return (
    <div
      className="flex flex-col h-full cursor-text overflow-hidden"
      style={{
        fontFamily: "var(--font-jetbrains-mono)",
        fontSize: "0.75rem",
        lineHeight: "1.5",
      }}
      onClick={handleContainerClick}
    >
      {/* Divider */}
      <div className="px-3 py-1" style={{ opacity: 0.4, borderTop: "1px solid currentColor" }}>
        terminal
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto px-3 pb-2">
        {terminalHistory.map((line, i) => (
          <div key={i} style={{ opacity: 0.85, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
            {line}
          </div>
        ))}
        <div ref={historyEndRef} />
      </div>

      {/* Input line */}
      <form onSubmit={handleSubmit} className="flex items-center px-3 pb-3 gap-1 shrink-0">
        <span style={{ opacity: 0.7 }}>{prompt}</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 bg-transparent outline-none border-none caret-current"
          style={{
            color: "inherit",
            fontFamily: "inherit",
            fontSize: "inherit",
          }}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </form>
    </div>
  );
}
