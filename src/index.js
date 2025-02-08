
import fs from "fs";
import path from "path";
import { generateComments } from "./commentor.js";
import { extractCodeBlocks } from "./parser.js";

export function processFile(filePath) {
  fs.readFile(filePath, "utf8", async (err, data) => {
    if (err) {
      console.error("❌ Error reading file:", err);
      return;
    }

    console.log("📄 Processing file:", filePath);

    // Extract code blocks (assuming this function gets individual functions/classes)
    const codeBlocks = extractCodeBlocks(data);

    // Generate comments for each code block
    const commentedCode = await generateComments(codeBlocks);

    // Instead of creating a new file, write back to the same file
    fs.writeFile(filePath, commentedCode, (err) => {
      if (err) console.error("❌ Error saving file:", err);
      else console.log("✅ File updated:", filePath);
    });
  });
}

