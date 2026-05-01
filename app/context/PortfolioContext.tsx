"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

// File system structure for terminal navigation
const FILE_SYSTEM: Record<string, string[]> = {
  "/": ["about", "career", "projects", "contact", "README.md"],
  "/about": ["hobbies.md", "family.md", "education.md"],
  "/career": ["experience.md", "skills.md"],
  "/projects": ["progiroc.md", "robokids.md"],
  "/contact": ["contact.md"],
};

interface PortfolioContextType {
  currentFile: string | null;
  expandedFolders: Set<string>;
  terminalHistory: string[];
  currentDir: string;
  openFile: (path: string) => void;
  toggleFolder: (name: string) => void;
  runCommand: (cmd: string) => void;
  addTerminalLine: (line: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'Welcome to razvan-aga. Type "ls" to explore.',
  ]);
  const [currentDir, setCurrentDir] = useState("/");

  const addTerminalLine = useCallback((line: string) => {
    setTerminalHistory((prev) => [...prev, line]);
  }, []);

  const openFile = useCallback(
    (path: string) => {
      setCurrentFile(path);
      // Derive the filename for the echo
      const parts = path.split("/");
      const filename = parts[parts.length - 1] + ".md";
      addTerminalLine(`> cat ${filename}`);
    },
    [addTerminalLine]
  );

  const toggleFolder = useCallback(
    (name: string) => {
      setExpandedFolders((prev) => {
        const next = new Set(prev);
        if (next.has(name)) {
          next.delete(name);
        } else {
          next.add(name);
        }
        return next;
      });
      addTerminalLine(`> cd /${name}`);
    },
    [addTerminalLine]
  );

  const runCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim();
      addTerminalLine(`${currentDir} > ${trimmed}`);

      if (!trimmed) return;

      const parts = trimmed.split(/\s+/);
      const command = parts[0];
      const arg = parts[1] ?? "";

      if (command === "clear") {
        setTerminalHistory([]);
        return;
      }

      if (command === "ls") {
        const entries = FILE_SYSTEM[currentDir];
        if (entries) {
          addTerminalLine(entries.join("  "));
        } else {
          addTerminalLine("No such directory.");
        }
        return;
      }

      if (command === "cd") {
        if (!arg || arg === "/") {
          setCurrentDir("/");
          return;
        }
        if (arg === "..") {
          if (currentDir === "/") {
            addTerminalLine("Already at root.");
          } else {
            const parent = currentDir.split("/").slice(0, -1).join("/") || "/";
            setCurrentDir(parent);
          }
          return;
        }
        // Support both "cd /about" and "cd about"
        const target = arg.startsWith("/") ? arg : `${currentDir === "/" ? "" : currentDir}/${arg}`;
        if (FILE_SYSTEM[target]) {
          setCurrentDir(target);
          // Expand the folder in the tree
          const folderName = target.replace("/", "");
          if (folderName) {
            setExpandedFolders((prev) => {
              const next = new Set(prev);
              next.add(folderName);
              return next;
            });
          }
        } else {
          addTerminalLine(`cd: no such directory: ${arg}`);
        }
        return;
      }

      if (command === "cat") {
        if (!arg) {
          addTerminalLine("cat: missing filename");
          return;
        }
        const filename = arg.endsWith(".md") ? arg : `${arg}.md`;
        // Determine directory to search
        const searchDir = currentDir;
        const entries = FILE_SYSTEM[searchDir] ?? [];
        if (entries.includes(filename)) {
          // Build file path: folder/filename (without .md extension for currentFile)
          const folder = searchDir === "/" ? "" : searchDir.replace("/", "");
          const filePath =
            searchDir === "/"
              ? filename === "README.md"
                ? "README"
                : filename.replace(".md", "")
              : `${folder}/${filename.replace(".md", "")}`;
          setCurrentFile(filePath);
        } else {
          addTerminalLine(`cat: ${arg}: No such file`);
        }
        return;
      }

      addTerminalLine(`command not found: ${command}`);
    },
    [currentDir, addTerminalLine]
  );

  return (
    <PortfolioContext.Provider
      value={{
        currentFile,
        expandedFolders,
        terminalHistory,
        currentDir,
        openFile,
        toggleFolder,
        runCommand,
        addTerminalLine,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio(): PortfolioContextType {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider");
  return ctx;
}
