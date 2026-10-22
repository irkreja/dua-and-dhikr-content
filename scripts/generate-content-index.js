// scripts/generate-content-index.js
const fs = require("node:fs/promises");
const path = require("node:path");

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, "data");
const CONTENT_DIR = path.join(DATA_DIR, "content");
const INDEX_FILE = path.join(DATA_DIR, "index.json");
const PACKAGE_JSON = path.join(ROOT_DIR, "package.json");

async function generateContentIndex() {
  // Read version from package.json
  const pkgContent = await fs.readFile(PACKAGE_JSON, "utf-8");
  const { version } = JSON.parse(pkgContent);

  const files = await fs.readdir(CONTENT_DIR);

  const jsonFiles = files
    .filter((file) => file.endsWith(".json"))
    .sort();

  const generated = [];

  for (const file of jsonFiles) {
    const filePath = path.join(CONTENT_DIR, file);
    const fileContent = await fs.readFile(filePath, "utf-8");
    const content = JSON.parse(fileContent);

    const types = Array.isArray(content.types)
      ? content.types
      : content.type
      ? [content.type]
      : [];

    generated.push({
      id: content.id,
      types,
      title: content.title,
    });
  }

  const payload = {
    version,
    items: generated,
  };

  await fs.writeFile(
    INDEX_FILE,
    `${JSON.stringify(payload, null, 2)}\n`,
    "utf-8"
  );

  console.log(
    `Generated content index v${version}: ${generated.length} items`
  );
}

generateContentIndex().catch((error) => {
  console.error("Failed to generate content index:", error);
  process.exit(1);
});