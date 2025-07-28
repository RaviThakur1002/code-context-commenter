import fs from "fs";
import { generateComments } from "./commentor.js";

export function processFile(filePath) {
  fs.readFile(filePath, "utf8", async (err, data) => {
    if (err) {
      console.error("❌ Error reading file:", err);
      return;
    }

    console.log("📄 Processing file:", filePath);

    try {
      // Send the entire file content directly to generate comments
      const commentedCode = await generateComments(data);

      // Write the commented code back to the file
      fs.writeFile(filePath, commentedCode, (err) => {
        if (err) console.error("❌ Error saving file:", err);
        else console.log("✅ File updated:", filePath);
      });
    } catch (error) {
      console.error("❌ Error processing file:", error);
    }
  });
}
