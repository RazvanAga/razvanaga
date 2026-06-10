"use client";

import { PortfolioProvider } from "./context/PortfolioContext";
import FileTree from "./components/FileTree";
import Terminal from "./components/Terminal";
import RightPanel from "./components/RightPanel";
import MobileTabs from "./components/MobileTabs";

interface PortfolioClientProps {
  content: Record<string, string>;
}

export default function PortfolioClient({ content }: PortfolioClientProps) {
  return (
    <PortfolioProvider>
      <div className="min-h-screen w-full md:flex md:items-center md:justify-center md:bg-frame">
        <div className="flex h-dvh flex-col overflow-hidden md:h-[80vh] md:w-[90vw] md:max-w-6xl md:flex-row md:border-2 md:border-ink">
          {/* Mobile navigation */}
          <div className="shrink-0 md:hidden">
            <MobileTabs />
          </div>

          {/* Desktop left panel */}
          <div className="left-panel hidden w-[280px] shrink-0 flex-col bg-ink text-paper md:flex">
            <div className="shrink-0">
              <FileTree />
            </div>
            <div className="flex-1 overflow-hidden">
              <Terminal />
            </div>
          </div>

          {/* Content panel (shared between mobile and desktop) */}
          <div className="flex-1 overflow-hidden">
            <RightPanel content={content} />
          </div>
        </div>
      </div>
    </PortfolioProvider>
  );
}
