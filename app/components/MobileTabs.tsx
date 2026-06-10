"use client";

import { useState, useRef, useEffect } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { FOLDERS, README, ContentFile } from "../lib/files";

interface TabData {
  label: string;
  key: string;
  files?: ContentFile[];
  isReadme?: boolean;
}

const TABS: TabData[] = [
  { label: "README", key: "readme", isReadme: true },
  ...FOLDERS.map((folder) => ({
    label: `/${folder.name}`,
    key: folder.name,
    files: folder.files,
  })),
];

export default function MobileTabs() {
  const [activeTab, setActiveTab] = useState("readme");
  const { openFile, currentFile } = usePortfolio();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [displayedFiles, setDisplayedFiles] = useState<ContentFile[]>([]);

  useEffect(() => {
    const idx = TABS.findIndex((t) => t.key === activeTab);
    const el = tabRefs.current[idx];
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeTab]);

  const handleTabClick = (tab: TabData) => {
    setActiveTab(tab.key);
    if (tab.isReadme) {
      openFile(README.path);
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
      className="flex flex-col bg-ink text-paper"
      style={{ fontFamily: "var(--font-jetbrains-mono)" }}
    >
      {/* Tab bar */}
      <div className="relative flex overflow-x-auto border-b border-paper/20">
        {TABS.map((tab, i) => (
          <button
            key={tab.key}
            ref={(el) => { tabRefs.current[i] = el; }}
            onClick={() => handleTabClick(tab)}
            className={`px-3 py-2 text-xs whitespace-nowrap shrink-0 text-paper ${
              activeTab === tab.key ? "bg-paper/15 opacity-100" : "bg-transparent opacity-60"
            }`}
            style={{ borderBottom: "2px solid transparent" }}
          >
            {tab.label}
          </button>
        ))}
        {/* Sliding indicator */}
        <span
          className="bg-paper"
          style={{
            position: "absolute",
            bottom: 0,
            left: indicator.left,
            width: indicator.width,
            height: "2px",
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
                  className={`px-4 py-2 text-sm cursor-pointer ${
                    isSelected ? "opacity-100 underline bg-paper/10" : "opacity-65 bg-transparent"
                  }`}
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
