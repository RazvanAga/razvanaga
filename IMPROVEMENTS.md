# Portfolio Improvement Suggestions

The site has a strong, distinctive concept — the file-explorer metaphor with the warm brown / cream palette is memorable and well-executed. The suggestions below are grouped by priority and type.

---

## Critical Bugs

### 1. `family.md` is invisible

`FILE_SYSTEM` in `PortfolioContext.tsx:8` includes `/about/family.md`, but `FileTree.tsx:15–41` only lists `hobbies.md` and `education.md` under `/about`. The file exists in the context for terminal `cat` navigation but can never be opened from the UI.

**Fix:** Add `{ name: "family.md", path: "about/family" }` to the `about` folder in `FOLDERS` inside `FileTree.tsx`.

### 2. URL routing is missing

The spec (`spec.md:89–93`) defines URL patterns (`/career/experience`, `/about/hobbies`, etc.) but the implementation never reads or writes the URL. Deep links are broken — pasting a URL always opens README.

**Fix:** Use `useSearchParams` or Next.js dynamic routes to reflect the current file in the URL and restore it on load.

---

## High-Impact UX Improvements

### 3. Content transitions feel abrupt

Switching files causes an instant content swap with no feedback. This breaks the "opening a file" illusion the concept is built on.

**Fix:** Add a short fade + upward slide on the right panel content. A simple approach:

```tsx
// In RightPanel.tsx — key the container div on currentFile
// so React remounts it and triggers the CSS animation
<div key={currentFile ?? "readme"} className="content-enter ...">
```

```css
/* globals.css */
@keyframes content-enter {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.content-enter {
  animation: content-enter 180ms ease forwards;
}
```

### 4. No `help` command in the terminal

Users unfamiliar with CLI will instinctively type `help`. Currently it returns `command not found: help`, which feels like a dead end rather than a feature.

**Fix:** Add a `help` handler in `PortfolioContext.tsx:78` that prints a short command reference:

```
Available commands:
  ls          list contents of current directory
  cd <dir>    change directory
  cat <file>  open a file
  pwd         print current directory
  clear       clear terminal
```

### 5. No `pwd` or `whoami` commands

`ls` and `cd` are there; `pwd` is the obvious next expectation. `whoami` would be a charming easter egg that fits the concept perfectly.

**Fix:** Add both to the `runCommand` switch in `PortfolioContext.tsx`. `whoami` could return `"Razvan Aga — fullstack engineer, builder of ProGiroc"`.

### 6. File path breadcrumb in the right panel

Right now there is no visual indicator of which file you are reading. On a real file system you'd always know where you are.

**Fix:** Add a small breadcrumb bar at the top of the right panel showing the path (e.g., `~/career/experience.md`) in JetBrains Mono at low opacity, sitting just above the markdown content.

```tsx
// Top of RightPanel content area
<div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "0.7rem", opacity: 0.4, marginBottom: "1.5rem" }}>
  ~/{currentFile ?? "README"}.md
</div>
```

---

## Visual Polish

### 7. Emoji file icons break the aesthetic

The `📄` emojis in `FileTree.tsx:93` and `FileTree.tsx:110` are rendered by the OS emoji engine, so they are colorful and inconsistent across platforms. They look out of place in a monochromatic brown palette.

**Fix:** Replace with a simple inline SVG:

```tsx
const FileIcon = () => (
  <svg width="11" height="13" viewBox="0 0 11 13" fill="none" style={{ opacity: 0.6, flexShrink: 0 }}>
    <path d="M1 1h6l3 3v8H1V1z" stroke="currentColor" strokeWidth="1" />
    <path d="M7 1v3h3" stroke="currentColor" strokeWidth="1" />
  </svg>
);
```

### 8. Folder hover state is missing

Files get a `translateX(2px)` nudge on hover (via `.file-row` in `globals.css:17`), but folder rows have no hover feedback at all. Clicking a folder feels unresponsive.

**Fix:** Apply `.file-row` to the folder row `div` in `FileTree.tsx:58`, or add a dedicated `.folder-row` class with a similar effect.

### 9. Subtle texture on the dark panel

The flat `#4a2f1f` left panel reads as plain. A very faint grain or noise texture would make it feel more like aged paper or wood — which fits the warm brown palette.

**Fix:** Add a CSS `background-image` with an SVG noise filter, or use a `::before` pseudo-element with a tiled noise PNG at 2–4% opacity. No external images needed:

```css
/* globals.css */
.left-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* SVG noise */
  opacity: 0.03;
  pointer-events: none;
}
```

### 10. Terminal welcome message could be more personal

`'Welcome to razvan-aga. Type "ls" to explore.'` is functional but generic. The terminal is the most interactive part of the site — the opening line should feel handcrafted.

**Suggestion:**

```
razvan-aga v1.0 — fullstack engineer, builder
type "ls" to start, or "help" for commands
```

### 11. Active folder has no visual distinction

When a folder is expanded, only its arrow rotates. The folder name itself has no change in opacity or weight. Compare: an active file gets underline + full opacity, but an active folder looks identical to a collapsed one.

**Fix:** When `isExpanded`, increase opacity to `1` and set `fontWeight: 600` on the folder `<span>` in `FileTree.tsx:68`.

---

## SEO & Metadata

### 12. Metadata is bare minimum

`layout.tsx:16` sets `title: "Razvan Aga"` and `description: "Portfolio"`. No Open Graph or Twitter card tags, so sharing on LinkedIn or Twitter shows no preview.

**Fix:**

```tsx
export const metadata: Metadata = {
  title: "Razvan Aga — Fullstack Engineer",
  description: "Fullstack engineer. Built ProGiroc (30k+ users). Embedded systems at Schaeffler. Based in Timisoara.",
  openGraph: {
    title: "Razvan Aga",
    description: "Fullstack engineer. Builder of ProGiroc.",
    url: "https://razvanaga.com",
    siteName: "Razvan Aga",
    type: "website",
  },
};
```

---

## Mobile Experience

### 13. Mobile tab bar loses context

On mobile, when you select a tab with sub-files (e.g. `/career`), the drawer opens below the tabs. When you then tap a file, the drawer stays open, cluttering the screen above the content.

**Fix:** Close the drawer automatically after a file is selected inside it:

```tsx
// In MobileTabs.tsx, inside the file click handler
onClick={() => { openFile(file.path); setDrawerOpen(false); }}
```

### 14. No contact on mobile without entering the tab

On desktop the terminal is always visible. On mobile there is no quick path to contact info other than navigating through the tabs. A persistent "Contact" button or footer could help.

---

## Content

### 15. README photo fallback

`RightPanel.tsx:228` renders `<img src="/razvan.jpg" ...>` directly. If the image is missing or slow to load, it shows a broken image icon. The `PhotoPlaceholder` component exists but is only used for the wedding photo.

**Fix:** Use `onError` to swap to `PhotoPlaceholder` if the image fails:

```tsx
<img
  src="/razvan.jpg"
  alt="Răzvan Aga"
  className="w-32 h-32 rounded-full object-cover mb-6"
  onError={(e) => { /* render fallback */ }}
/>
```

Or switch to Next.js `<Image>` with a placeholder to avoid layout shift.

### 16. Copy-to-clipboard on contact links

The contact links in `RightPanel.tsx:47–68` open `mailto:` and external URLs, which is correct. But email and GitHub URL copy would be a quality-of-life addition, especially on desktop where right-clicking to copy is natural.

**Fix:** Add a subtle clipboard icon button next to each `ContactIcon` that copies the value and briefly flashes a checkmark confirmation.

---

## Code Quality

### 17. Inline style repetition

`#4a2f1f` and `#eae9df` appear as hardcoded strings in at least 12 places across `PortfolioClient.tsx`, `RightPanel.tsx`, `FileTree.tsx`, `Terminal.tsx`, and `MobileTabs.tsx`. This means a palette change requires touching every file.

**Fix:** Define them once in `globals.css`:

```css
:root {
  --color-dark: #4a2f1f;
  --color-light: #eae9df;
}
```

Then use `var(--color-dark)` everywhere. Tailwind's `@theme` block (already used in `globals.css:3`) can expose them as utility classes too.

### 18. No fetch cache for content

`RightPanel.tsx:246` fetches content on every file switch, with no caching. Returning to a previously visited file makes a redundant network round-trip.

**Fix:** Keep a simple `useRef` map of `path → content` strings and skip the fetch if the content is already cached:

```tsx
const cache = useRef<Record<string, string>>({});
// Before fetch:
if (cache.current[file]) { setContent(cache.current[file]); return; }
// After fetch:
cache.current[file] = text;
```
