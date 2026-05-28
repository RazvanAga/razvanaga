"use client";

import { usePortfolio } from "../context/PortfolioContext";

const FileIcon = () => (
  <svg width="11" height="13" viewBox="0 0 11 13" fill="none" style={{ opacity: 0.6, flexShrink: 0 }}>
    <path d="M1 1h6l3 3v8H1V1z" stroke="currentColor" strokeWidth="1" />
    <path d="M7 1v3h3" stroke="currentColor" strokeWidth="1" />
  </svg>
);

interface FileNode {
  name: string;
  path: string;
}

interface FolderNode {
  name: string;
  files: FileNode[];
}

const FOLDERS: FolderNode[] = [
  {
    name: "career",
    files: [
      { name: "experience.md", path: "career/experience" },
      { name: "skills.md", path: "career/skills" },
      { name: "education.md", path: "career/education" },
    ],
  },
  {
    name: "projects",
    files: [
      { name: "progiroc.md", path: "projects/progiroc" },
      { name: "robokids.md", path: "projects/robokids" },
    ],
  },
  {
    name: "contact",
    files: [{ name: "contact.md", path: "contact/contact" }],
  },
];

export default function FileTree() {
  const { currentFile, expandedFolders, openFile, toggleFolder } = usePortfolio();

  return (
    <div
      className="px-3 py-3 select-none"
      style={{ fontFamily: "var(--font-jetbrains-mono)" }}
    >
      {/* Folders */}
      {FOLDERS.map((folder) => {
        const isExpanded = expandedFolders.has(folder.name);
        return (
          <div key={folder.name}>
            {/* Folder row */}
            <div
              className="flex items-center gap-1 py-0.5 px-1 cursor-pointer rounded-sm"
              style={{ opacity: 0.9 }}
              onClick={() => toggleFolder(folder.name)}
            >
              <span
                className="text-xs"
                style={{
                  display: "inline-block",
                  transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 250ms ease",
                }}
              >▶</span>
              <span
                className="text-sm"
                style={{
                  fontWeight: isExpanded ? 600 : undefined,
                  opacity: isExpanded ? 1 : undefined,
                }}
              >/{folder.name}</span>
            </div>

            {/* Files inside folder */}
            <div
              style={{
                display: "grid",
                gridTemplateRows: isExpanded ? "1fr" : "0fr",
                transition: "grid-template-rows 250ms ease",
              }}
            >
              <div className="overflow-hidden">
                <div className="ml-4">
                  {folder.files.map((file) => {
                    const isSelected = currentFile === file.path;
                    return (
                      <div
                        key={file.path}
                        className="file-row flex items-center gap-1 py-0.5 px-1 cursor-pointer rounded-sm"
                        style={{ opacity: isSelected ? 1 : 0.65 }}
                        onClick={() => openFile(file.path)}
                      >
                        <FileIcon />
                        <span className="text-sm" style={{ textDecoration: isSelected ? "underline" : "none" }}>{file.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* README at root */}
      <div
        className="file-row flex items-center gap-1 py-0.5 px-1 cursor-pointer rounded-sm"
        style={{ opacity: currentFile === "README" || currentFile === null ? 1 : 0.6 }}
        onClick={() => openFile("README")}
      >
        <FileIcon />
        <span className="text-sm" style={{ textDecoration: currentFile === "README" || currentFile === null ? "underline" : "none" }}>README.md</span>
      </div>
    </div>
  );
}
