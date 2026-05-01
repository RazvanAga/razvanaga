import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");

// Allowed file paths to prevent directory traversal
const ALLOWED_FILES = new Set([
  "README",
  "about/hobbies",
  "about/family",
  "about/education",
  "career/experience",
  "career/skills",
  "projects/progiroc",
  "projects/robokids",
  "contact/contact",
]);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file");

  if (!file || !ALLOWED_FILES.has(file)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const filePath = path.join(CONTENT_DIR, `${file}.md`);

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return new NextResponse(content, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
