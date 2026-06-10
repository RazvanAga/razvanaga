"use client";

import { useRef, useEffect, useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { FILE_SYSTEM } from "../lib/files";

const COMMANDS = ["ls", "cd", "cat", "pwd", "whoami", "clear", "help"];

export default function Terminal() {
  const { terminalHistory, currentDir, runCommand, addTerminalLine } = usePortfolio();
  const [inputValue, setInputValue] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [savedInput, setSavedInput] = useState("");
  const [flashing, setFlashing] = useState(false);
  const [focused, setFocused] = useState(false);
  const historyEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom whenever history updates
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setFlashing(true);
    setTimeout(() => {
      setFlashing(false);
      setCommandHistory((prev) => [inputValue, ...prev]);
      setHistoryIndex(-1);
      setSavedInput("");
      runCommand(inputValue);
      setInputValue("");
    }, 80);
  };

  const handleTabComplete = () => {
    const parts = inputValue.split(/\s+/);
    const isFirstToken = parts.length <= 1;

    if (isFirstToken) {
      const partial = parts[0] ?? "";
      const matches = COMMANDS.filter((c) => c.startsWith(partial));
      if (matches.length === 1) {
        setInputValue(matches[0] + " ");
      } else if (matches.length > 1 && partial) {
        addTerminalLine(matches.join("  "));
      }
      return;
    }

    const command = parts[0];
    const partial = parts[parts.length - 1];
    let entries = FILE_SYSTEM[currentDir] ?? [];
    if (command === "cd") entries = entries.filter((entry) => !entry.endsWith(".md"));
    if (command === "cat") entries = entries.filter((entry) => entry.endsWith(".md"));

    const matches = entries.filter((entry) => entry.startsWith(partial));
    if (matches.length === 1) {
      setInputValue([...parts.slice(0, -1), matches[0]].join(" "));
    } else if (matches.length > 1) {
      addTerminalLine(matches.join("  "));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      handleTabComplete();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      if (historyIndex === -1) setSavedInput(inputValue);
      const nextIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(nextIndex);
      setInputValue(commandHistory[nextIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      setInputValue(nextIndex === -1 ? savedInput : commandHistory[nextIndex]);
    }
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
          <div key={i} className="terminal-line" style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
            {line}
          </div>
        ))}
        <div ref={historyEndRef} />
      </div>

      {/* Input line */}
      <form onSubmit={handleSubmit} className="flex items-center px-3 pb-3 gap-1 shrink-0">
        <span style={{
          opacity: 0.7,
          display: "inline-block",
          transform: focused ? "translateX(2px)" : "translateX(0)",
          transition: "transform 150ms ease",
        }}>{prompt}</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent outline-none border-none caret-current cursor-pulse"
          style={{
            color: "inherit",
            fontFamily: "inherit",
            fontSize: "inherit",
            opacity: flashing ? 0.2 : 1,
            transition: "opacity 80ms ease",
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
