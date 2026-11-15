const fs = require("node:fs");
const path = require("node:path");

const file = path.resolve("data/adhkar.json");
const backup = `${file}.old`;

const data = JSON.parse(fs.readFileSync(file, "utf8"));

if (!Array.isArray(data.items)) {
  throw new Error("data.items must be an array");
}

fs.copyFileSync(file, backup, fs.constants.COPYFILE_EXCL);

data.items.forEach((item, i) => {
  item.id = String(i + 1);
});

fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");

console.log(`Done: ${data.items.length} items re-indexed. Backup: ${backup}`);