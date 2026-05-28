"use client";

import { useState, useRef, useEffect } from "react";
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
    label: "/career",
    key: "career",
    files: [
      { name: "experience.md", path: "career/experience" },
      { name: "skills.md", path: "career/skills" },
      { name: "education.md", path: "career/education" },
    ],
  },
  {
    label: "/projects",
    key: "projects",
    files: [
      { name: "progiroc.md", path: "projects/progiroc" },
      { name: "robokids.md", path: "projects/robokids" },
    ],
  },
  {
    label: "/contact",
    key: "contact",
    files: [{ name: "contact.md", path: "contact/contact" }],
  },
];

export default function MobileTabs() {
  const [activeTab, setActiveTab] = useState("readme");
  const { openFile, currentFile } = usePortfolio();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [displayedFiles, setDisplayedFiles] = useState<FileEntry[]>([]);

  const currentTab = TABS.find((t) => t.key === activeTab);

  useEffect(() => {
    const idx = TABS.findIndex((t) => t.key === activeTab);
    const el = tabRefs.current[idx];
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeTab]);

  const handleTabClick = (tab: TabData) => {
    setActiveTab(tab.key);
    if (tab.isReadme) {
      openFile("README");
      setDrawerOpen(false);
    } else if (tab.files) {
      if (drawerOpen) {
        setDrawerOpen(false);
        setTimeout(() => {
          setDisplayedFiles(tab.files!);
          setDrawerOpen(true);
        }, 500);
      } else {
        setDisplayedFiles(tab.files);
        setDrawerOpen(true);
      }
    }
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
      <div className="relative flex overflow-x-auto" style={{ borderBottom: "1px solid rgba(234,233,223,0.2)" }}>
        {TABS.map((tab, i) => (
          <button
            key={tab.key}
            ref={(el) => { tabRefs.current[i] = el; }}
            onClick={() => handleTabClick(tab)}
            className="px-3 py-2 text-xs whitespace-nowrap shrink-0"
            style={{
              backgroundColor: activeTab === tab.key ? "rgba(234,233,223,0.15)" : "transparent",
              color: "#eae9df",
              opacity: activeTab === tab.key ? 1 : 0.6,
              borderBottom: "2px solid transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
        {/* Sliding indicator */}
        <span
          style={{
            position: "absolute",
            bottom: 0,
            left: indicator.left,
            width: indicator.width,
            height: "2px",
            backgroundColor: "#eae9df",
            transition: "left 400ms ease, width 400ms ease",
          }}
        />
      </div>

      {/* File list */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: drawerOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 500ms ease",
        }}
      >
        <div className="overflow-hidden">
          <div className="py-1">
            {displayedFiles.map((file) => {
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
                  onClick={() => openFile(file.path)}
                >
                  {file.name}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
