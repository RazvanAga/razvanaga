// Single source of truth for the portfolio's virtual file system.
// The file tree, mobile tabs, terminal, and content loading all derive from this.

export interface ContentFile {
  name: string; // display name, e.g. "skills.md"
  path: string; // content key, e.g. "career/skills" (maps to content/career/skills.md)
}

export interface ContentFolder {
  name: string;
  files: ContentFile[];
}

export const README: ContentFile = { name: "README.md", path: "README" };

export const FOLDERS: ContentFolder[] = [
  {
    name: "career",
    files: [
      { name: "experience.md", path: "career/experience" },
      { name: "skills.md", path: "career/skills" },
      { name: "education.md", path: "career/education" },
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

export const ALL_FILES: ContentFile[] = [README, ...FOLDERS.flatMap((f) => f.files)];

// Terminal navigation: directory -> entries
export const FILE_SYSTEM: Record<string, string[]> = {
  "/": [...FOLDERS.map((f) => f.name), README.name],
  ...Object.fromEntries(FOLDERS.map((f) => [`/${f.name}`, f.files.map((file) => file.name)])),
};

// Resolve a directory + filename to a content path, or null if it doesn't exist.
export function contentPathFor(dir: string, filename: string): string | null {
  if (dir === "/") return filename === README.name ? README.path : null;
  const folder = FOLDERS.find((f) => `/${f.name}` === dir);
  return folder?.files.find((f) => f.name === filename)?.path ?? null;
}
