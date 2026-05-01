import fs from "fs";
import path from "path";
import PortfolioClient from "./PortfolioClient";

export default function Home() {
  const readmePath = path.join(process.cwd(), "content", "README.md");
  const initialContent = fs.readFileSync(readmePath, "utf-8");

  return <PortfolioClient initialContent={initialContent} />;
}
