
const fs = require("fs");
const path = require("path");

// Paths relative to project root
const inputPath = path.join(__dirname, "../examples/verse.json");
const outputPath = path.join(__dirname, "../examples/output.json");

// Read input JSON
const data = JSON.parse(
  fs.readFileSync(inputPath, "utf8")
);

// Transform verses
const result = data.verses.map((verse) => ({
  text: verse.text_indopak_nastaleeq || "",

  translation:
    verse.translations?.find(
      (t) => t.resource_id === 162
    )?.text || "",

  // page_number: verse.page_number,

  words: (verse.words || []).map((word) => ({
    ar: word.text_indopak_nastaleeq || "",
    bn: word.translation?.text || ""
  }))
}));

// Save output JSON
fs.writeFileSync(
  outputPath,
  JSON.stringify(result, null, 2),
  "utf8"
);

console.log(`Successfully saved: ${outputPath}`);
