"use client";

import { PortfolioProvider } from "./context/PortfolioContext";
import FileTree from "./components/FileTree";
import Terminal from "./components/Terminal";
import RightPanel from "./components/RightPanel";
import MobileTabs from "./components/MobileTabs";

interface PortfolioClientProps {
  initialContent: string;
}

export default function PortfolioClient({ initialContent }: PortfolioClientProps) {
  return (
    <PortfolioProvider>
      {/* Desktop layout */}
      <div
        className="hidden md:flex min-h-screen w-full items-center justify-center"
        style={{ backgroundColor: "#2a1a0e" }}
      >
        <div
          className="flex overflow-hidden w-[90vw] max-w-6xl h-[80vh]"
          style={{ border: "2px solid #4a2f1f" }}
        >
          {/* Left panel */}
          <div
            className="flex flex-col shrink-0"
            style={{
              width: "280px",
              backgroundColor: "#4a2f1f",
              color: "#eae9df",
            }}
          >
            <div className="shrink-0">
              <FileTree />
            </div>
            <div className="flex-1 overflow-hidden">
              <Terminal />
            </div>
          </div>

          {/* Right panel */}
          <div className="flex-1 overflow-hidden">
            <RightPanel initialContent={initialContent} />
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div
        className="flex md:hidden flex-col h-screen overflow-hidden"
        style={{ backgroundColor: "#eae9df" }}
      >
        <div className="shrink-0">
          <MobileTabs />
        </div>
        <div className="flex-1 overflow-hidden">
          <RightPanel initialContent={initialContent} />
        </div>
      </div>
    </PortfolioProvider>
  );
}
