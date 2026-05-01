"use client";

import { useEffect, useState } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { usePortfolio } from "../context/PortfolioContext";

interface RightPanelProps {
  initialContent: string;
}

// Photo placeholder component
function PhotoPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="w-32 h-32 rounded-full flex items-center justify-center mb-6 text-xs text-center leading-tight"
      style={{
        backgroundColor: "#4a2f1f",
        color: "#eae9df",
        fontFamily: "var(--font-jetbrains-mono)",
        opacity: 0.6,
      }}
    >
      {label}
    </div>
  );
}

const markdownComponents: Components = {
  p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
  h1: ({ children }) => (
    <h1
      className="text-3xl font-bold mb-6 mt-0"
      style={{ fontFamily: "var(--font-jetbrains-mono)" }}
    >
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2
      className="text-xl font-bold mb-3 mt-8"
      style={{ fontFamily: "var(--font-jetbrains-mono)" }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      className="text-lg font-semibold mb-2 mt-6"
      style={{ fontFamily: "var(--font-jetbrains-mono)" }}
    >
      {children}
    </h3>
  ),
  hr: () => <hr className="my-6" style={{ borderColor: "#4a2f1f", opacity: 0.2 }} />,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "#4a2f1f", textDecorationStyle: "dotted" }}
      className="underline"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  code: ({ children, className }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <pre
          className="p-4 rounded my-4 overflow-x-auto"
          style={{
            backgroundColor: "#4a2f1f",
            color: "#eae9df",
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "0.85rem",
          }}
        >
          <code>{children}</code>
        </pre>
      );
    }
    return (
      <code
        className="px-1 rounded text-sm"
        style={{
          backgroundColor: "#4a2f1f",
          color: "#eae9df",
          fontFamily: "var(--font-jetbrains-mono)",
        }}
      >
        {children}
      </code>
    );
  },
  table: ({ children }) => (
    <div className="overflow-x-auto mb-4">
      <table className="w-full border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th
      className="text-left px-3 py-2 font-bold"
      style={{
        borderBottom: "2px solid #4a2f1f",
        fontFamily: "var(--font-jetbrains-mono)",
      }}
    >
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td
      className="px-3 py-2"
      style={{ borderBottom: "1px solid rgba(74,47,31,0.2)" }}
    >
      {children}
    </td>
  ),
};

// Pre-process content: replace sentinel markers with placeholder components
function ContentWithPlaceholders({ content }: { content: string }) {
  const PHOTO_SENTINEL = "::photo-placeholder::";
  const WEDDING_SENTINEL = "::wedding-photo-placeholder::";

  const parts: Array<{ type: "markdown" | "photo" | "wedding"; text: string }> = [];
  let remaining = content;

  while (remaining.length > 0) {
    const photoIdx = remaining.indexOf(PHOTO_SENTINEL);
    const weddingIdx = remaining.indexOf(WEDDING_SENTINEL);

    const firstIdx =
      photoIdx === -1
        ? weddingIdx
        : weddingIdx === -1
        ? photoIdx
        : Math.min(photoIdx, weddingIdx);

    if (firstIdx === -1) {
      parts.push({ type: "markdown", text: remaining });
      break;
    }

    if (firstIdx > 0) {
      parts.push({ type: "markdown", text: remaining.slice(0, firstIdx) });
    }

    if (remaining.indexOf(PHOTO_SENTINEL) === firstIdx) {
      parts.push({ type: "photo", text: "" });
      remaining = remaining.slice(firstIdx + PHOTO_SENTINEL.length);
    } else {
      parts.push({ type: "wedding", text: "" });
      remaining = remaining.slice(firstIdx + WEDDING_SENTINEL.length);
    }
  }

  return (
    <>
      {parts.map((part, i) => {
        if (part.type === "photo") {
          return <PhotoPlaceholder key={i} label="Photo coming soon" />;
        }
        if (part.type === "wedding") {
          return <PhotoPlaceholder key={i} label="Wedding photo coming soon" />;
        }
        return (
          <ReactMarkdown key={i} remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {part.text}
          </ReactMarkdown>
        );
      })}
    </>
  );
}

export default function RightPanel({ initialContent }: RightPanelProps) {
  const { currentFile } = usePortfolio();
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const file = currentFile ?? "README";

    const fetchContent = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/content?file=${encodeURIComponent(file)}`);
        if (res.ok) {
          const text = await res.text();
          setContent(text);
        } else {
          setContent(`# Not Found\n\nFile not found: ${file}`);
        }
      } catch {
        setContent("# Error\n\nFailed to load content.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [currentFile]);

  return (
    <div
      className="h-full overflow-y-auto px-8 py-10"
      style={{
        fontFamily: "var(--font-source-serif-4)",
        color: "#4a2f1f",
        backgroundColor: "#eae9df",
        opacity: loading ? 0.6 : 1,
        transition: "opacity 0.1s",
      }}
    >
      <div className="max-w-2xl mx-auto">
        <ContentWithPlaceholders content={content} />
      </div>
    </div>
  );
}
