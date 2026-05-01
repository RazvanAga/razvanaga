# Portfolio Website Spec — razvanaga.com

## Concept

A personal portfolio that simulates a file explorer. The left panel shows a folder/file tree and a functional terminal. The right panel renders the selected `.md` file as formatted content. Navigation happens by clicking the tree or typing commands in the terminal.

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Markdown rendering:** `react-markdown` with `remark-gfm`
- **Fonts:** JetBrains Mono (left panel, via Google Fonts), Source Serif 4 (right panel, via Google Fonts)
- **Deployment:** Vercel (replacing existing portfolio on the same domain)
- **Domain:** razvanaga.com

---

## Color Palette

| Role | Hex |
|---|---|
| Left panel background | `#4a2f1f` |
| Left panel text | `#eae9df` |
| Right panel background | `#eae9df` |
| Right panel text | `#4a2f1f` |

No other colors for now. Keep it strictly to these two, inverted across panels.

---

## Layout

### Desktop (default)

```
┌─────────────────┬────────────────────────────────────┐
│  FILE TREE      │                                    │
│  (dark, ~25%)   │   MARKDOWN CONTENT                 │
│                 │   (light, ~75%)                    │
│─────────────────│                                    │
│  TERMINAL       │                                    │
│  (dark, ~25%)   │                                    │
└─────────────────┴────────────────────────────────────┘
```

- No top bar, no header, no nav — bare layout
- Left panel divided into two sections: file tree (top) and terminal (bottom)
- File tree height: enough to show all folders collapsed comfortably
- Terminal fills remaining left panel height
- Right panel: full height, scrollable, renders selected `.md` file

### Mobile

- Replace split layout with tabs at the top: one tab per root folder + one for README
- Selecting a tab shows the folder contents or file below
- Terminal hidden on mobile

---

## File Structure

```
README.md               ← default, open on load
/about
  ├── hobbies.md
  ├── family.md
  └── education.md
/career
  ├── experience.md
  └── skills.md
/projects
  ├── progiroc.md
  └── robokids.md
/contact
  └── contact.md
```

---

## File Tree Behavior

- All folders **collapsed by default**
- Click a folder → expand/collapse it; terminal echoes `cd /foldername`
- Click a file → open it in the right panel; terminal echoes `cat filename.md`
- `cd ..` echoed when collapsing or going up
- Currently selected file is visually highlighted (use opacity or underline, same color palette)
- URL updates to reflect selected file: e.g. `/about/family` when `family.md` is open
- Deep links work: visiting `/career/experience` directly opens that file

---

## Terminal

Located at the bottom of the left panel. Monospace font, same dark background.

### Supported commands

| Command | Behavior |
|---|---|
| `cd /foldername` | Navigate into folder, expand it in tree |
| `cd ..` | Go up one level |
| `ls` | List files/folders in current directory |
| `cat filename.md` | Open file in right panel |

### Terminal behavior
- Shows a history of previous commands above the input
- Input line: `> ` prefix, blinking cursor
- Clicking in the file tree echoes the equivalent command in the terminal automatically
- Invalid command → show: `command not found: [input]`
- Terminal is scrollable if history grows long

---

## URL & Routing

- `/` → `README.md` open
- `/about` → `/about` folder open, no file selected
- `/about/family` → `family.md` open
- `/career/experience` → `experience.md` open
- etc.

---

## Content

### `README.md`
- Photo of Razvan
- Name, age (24), location (Giroc, Romania)
- CV profile paragraph:
  > Fullstack Software Engineer with 3 years of professional experience who independently builds and ships real products. Built and launched ProGiroc — a community platform serving 30k+ users — from scratch using Next.js, Supabase, and a self-managed VPS. Background in safety-critical embedded systems at a top-tier automotive supplier. Looking for a product company where the work ships to real users.

### `/about/hobbies.md`
- To be written by Razvan

### `/about/family.md`
- Wedding photo
- Short paragraph: newly married

### `/about/education.md`
- Master's: Cloud Computing and IoT — Politehnica University Timisoara, 2024–present
- Bachelor's: Systems Engineering — Politehnica University Timisoara, 2020–2024

### `/career/experience.md`
- Vitesco Technologies / Schaeffler — Software Engineer (July 2023 – May 2026)
  - BMS for EVs, OEMs: BMW, Mercedes, Nissan
  - Unit test suites in C for safety-critical BMS firmware; validation on physical testbenches
  - MISRA-C and CERT-C compliance through static analysis; code integration and reviews
  - Internal Python tooling adopted across multiple engineering teams
- ProGiroc — Founder (November 2025 – present)
  - Next.js, Supabase, Linux VPS, Nginx
  - 30k+ Facebook community members
  - 500+ active listings, monetized through promoted listings
- RoboKids — Founder & Instructor (September 2024 – present)
  - Scratch, Python, Arduino, electronics
  - Full curriculum designed and run independently

### `/career/skills.md`
- Languages: TypeScript, JavaScript, Python, C, C++
- Frontend: React, Next.js
- Backend & Databases: Supabase, PostgreSQL, Flask
- DevOps: Git, Docker, Linux/VPS, Nginx
- Languages spoken: Romanian (native), English (fluent), Russian (basic), French (basic)

### `/projects/progiroc.md`
- Full description of ProGiroc: what it is, tech stack, scale, link to live site

### `/projects/robokids.md`
- Full description of RoboKids: what it is, what's taught, current stage

### `/contact/contact.md`
- Email: mail@razvanaga.com
- LinkedIn: https://www.linkedin.com/in/razvan-aga-5b5300278/
- GitHub: https://github.com/RazvanAga

---

## Animations

Noted for a later phase — not in scope for v1.

---

## Out of Scope (v1)

- Blog or writing section
- Dark/light mode toggle
- Search
- Any backend or CMS
- Analytics (can add Vercel Analytics later with one line)

