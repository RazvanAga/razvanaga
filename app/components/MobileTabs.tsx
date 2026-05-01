"use client";

import { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";

interface FileEntry {
  name: string;
  path: string;
}

interface TabData {
  label: string;
  key: string;
  files?: FileEntry[];
  isReadme?: boolean;
}

const TABS: TabData[] = [
  { label: "README", key: "readme", isReadme: true },
  {
    label: "about/",
    key: "about",
    files: [
      { name: "hobbies.md", path: "about/hobbies" },
      { name: "family.md", path: "about/family" },
      { name: "education.md", path: "about/education" },
    ],
  },
  {
    label: "career/",
    key: "career",
    files: [
      { name: "experience.md", path: "career/experience" },
      { name: "skills.md", path: "career/skills" },
    ],
  },
  {
    label: "projects/",
    key: "projects",
    files: [
      { name: "progiroc.md", path: "projects/progiroc" },
      { name: "robokids.md", path: "projects/robokids" },
    ],
  },
  {
    label: "contact/",
    key: "contact",
    files: [{ name: "contact.md", path: "contact/contact" }],
  },
];

export default function MobileTabs() {
  const [activeTab, setActiveTab] = useState("readme");
  const { openFile, currentFile } = usePortfolio();

  const currentTab = TABS.find((t) => t.key === activeTab);

  const handleTabClick = (tab: TabData) => {
    setActiveTab(tab.key);
    if (tab.isReadme) {
      openFile("README");
    }
  };

  const handleFileClick = (file: FileEntry) => {
    openFile(file.path);
  };

  return (
    <div
      className="flex flex-col"
      style={{
        backgroundColor: "#4a2f1f",
        color: "#eae9df",
        fontFamily: "var(--font-jetbrains-mono)",
      }}
    >
      {/* Tab bar */}
      <div className="flex overflow-x-auto" style={{ borderBottom: "1px solid rgba(234,233,223,0.2)" }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabClick(tab)}
            className="px-3 py-2 text-xs whitespace-nowrap shrink-0"
            style={{
              backgroundColor: activeTab === tab.key ? "rgba(234,233,223,0.15)" : "transparent",
              color: "#eae9df",
              opacity: activeTab === tab.key ? 1 : 0.6,
              borderBottom: activeTab === tab.key ? "2px solid #eae9df" : "2px solid transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* File list (only shown for folder tabs) */}
      {currentTab && !currentTab.isReadme && currentTab.files && (
        <div className="py-1">
          {currentTab.files.map((file) => {
            const isSelected = currentFile === file.path;
            return (
              <div
                key={file.path}
                className="px-4 py-2 text-sm cursor-pointer"
                style={{
                  opacity: isSelected ? 1 : 0.65,
                  textDecoration: isSelected ? "underline" : "none",
                  backgroundColor: isSelected ? "rgba(234,233,223,0.1)" : "transparent",
                }}
                onClick={() => handleFileClick(file)}
              >
                {file.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
