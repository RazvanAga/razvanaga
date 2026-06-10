import fs from "fs";
import path from "path";
import PortfolioClient from "./PortfolioClient";
import { ALL_FILES } from "./lib/files";

export default function Home() {
  const contentDir = path.join(process.cwd(), "content");
  const content = Object.fromEntries(
    ALL_FILES.map((file) => [
      file.path,
      fs.readFileSync(path.join(contentDir, `${file.path}.md`), "utf-8"),
    ])
  );

  return <PortfolioClient content={content} />;
}
