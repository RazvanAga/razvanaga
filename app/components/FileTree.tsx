"use client";

import { usePortfolio } from "../context/PortfolioContext";

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
    name: "about",
    files: [
      { name: "hobbies.md", path: "about/hobbies" },
      { name: "family.md", path: "about/family" },
      { name: "education.md", path: "about/education" },
    ],
  },
  {
    name: "career",
    files: [
      { name: "experience.md", path: "career/experience" },
      { name: "skills.md", path: "career/skills" },
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
      {/* README at root */}
      <div
        className="flex items-center gap-1 py-0.5 px-1 cursor-pointer rounded-sm"
        style={{
          opacity: currentFile === "README" || currentFile === null ? 1 : 0.6,
          textDecoration:
            currentFile === "README" || currentFile === null ? "underline" : "none",
        }}
        onClick={() => openFile("README")}
      >
        <span className="text-xs">📄</span>
        <span className="text-sm">README.md</span>
      </div>

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
              <span className="text-xs">{isExpanded ? "▼" : "▶"}</span>
              <span className="text-sm">/{folder.name}</span>
            </div>

            {/* Files inside folder */}
            {isExpanded && (
              <div className="ml-4">
                {folder.files.map((file) => {
                  const isSelected = currentFile === file.path;
                  return (
                    <div
                      key={file.path}
                      className="flex items-center gap-1 py-0.5 px-1 cursor-pointer rounded-sm"
                      style={{
                        opacity: isSelected ? 1 : 0.65,
                        textDecoration: isSelected ? "underline" : "none",
                      }}
                      onClick={() => openFile(file.path)}
                    >
                      <span className="text-xs">📄</span>
                      <span className="text-sm">{file.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
