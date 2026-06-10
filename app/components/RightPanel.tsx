"use client";

import Image from "next/image";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { usePortfolio } from "../context/PortfolioContext";
import { README } from "../lib/files";

interface RightPanelProps {
  content: Record<string, string>;
}

const CONTACT_ITEMS = {
  "contact-email": {
    href: "mailto:mail@razvanaga.com",
    label: "mail@razvanaga.com",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  "contact-linkedin": {
    href: "https://www.linkedin.com/in/razvan-aga-5b5300278/",
    label: "linkedin.com/in/razvan-aga",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  "contact-github": {
    href: "https://github.com/RazvanAga",
    label: "github.com/RazvanAga",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
} as const;

type ContactKey = keyof typeof CONTACT_ITEMS;

function ContactIcon({ type }: { type: ContactKey }) {
  const { href, label, icon } = CONTACT_ITEMS[type];
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 py-3 px-4 mb-3 no-underline text-ink border border-ink/25"
      style={{
        fontFamily: "var(--font-jetbrains-mono)",
        fontSize: "0.9rem",
        transition: "opacity 0.15s",
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = "0.65")}
      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}

// Photo placeholder component
function PhotoPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="w-32 h-32 rounded-full flex items-center justify-center mb-6 text-xs text-center leading-tight bg-ink text-paper"
      style={{
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
  hr: () => <hr className="my-6 border-ink/20" />,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline text-ink"
      style={{ textDecorationStyle: "dotted" }}
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
          className="p-4 rounded my-4 overflow-x-auto bg-ink text-paper"
          style={{
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
        className="px-1 rounded text-sm bg-ink text-paper"
        style={{ fontFamily: "var(--font-jetbrains-mono)" }}
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
      className="text-left px-3 py-2 font-bold border-b-2 border-ink"
      style={{ fontFamily: "var(--font-jetbrains-mono)" }}
    >
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 border-b border-ink/20">{children}</td>
  ),
};

type PartType = "markdown" | "photo" | "wedding" | ContactKey;

const SENTINELS: Record<string, PartType> = {
  "::photo-placeholder::": "photo",
  "::wedding-photo-placeholder::": "wedding",
  "::contact-email::": "contact-email",
  "::contact-linkedin::": "contact-linkedin",
  "::contact-github::": "contact-github",
};

function ContentWithPlaceholders({ content }: { content: string }) {
  const parts: Array<{ type: PartType; text: string }> = content
    .split(/(::[\w-]+::)/g)
    .filter((segment) => segment.length > 0)
    .map((segment) =>
      segment in SENTINELS
        ? { type: SENTINELS[segment], text: "" }
        : { type: "markdown" as const, text: segment }
    );

  return (
    <>
      {parts.map((part, i) => {
        if (part.type === "photo")
          return (
            <Image
              key={i}
              src="/razvan.jpg"
              alt="Răzvan Aga"
              width={128}
              height={128}
              className="w-32 h-32 rounded-full object-cover mb-6"
              priority
            />
          );
        if (part.type === "wedding") return <PhotoPlaceholder key={i} label="Wedding photo coming soon" />;
        if (part.type in CONTACT_ITEMS) return <ContactIcon key={i} type={part.type as ContactKey} />;
        return (
          <ReactMarkdown key={i} remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {part.text}
          </ReactMarkdown>
        );
      })}
    </>
  );
}

export default function RightPanel({ content }: RightPanelProps) {
  const { currentFile } = usePortfolio();
  const file = currentFile ?? README.path;
  const markdown = content[file] ?? `# Not Found\n\nFile not found: ${file}`;

  return (
    <div
      className="h-full overflow-y-auto px-8 py-10 text-ink bg-paper"
      style={{ fontFamily: "var(--font-source-serif-4)" }}
    >
      <div key={file} className="max-w-2xl mx-auto content-enter">
        <ContentWithPlaceholders content={markdown} />
      </div>
    </div>
  );
}
