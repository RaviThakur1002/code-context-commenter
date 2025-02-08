
#!/usr/bin/env node
import { processFile } from '../src/index.js';
import { getGeminiApiKey, clearApiKey } from '../src/config.js';

const args = process.argv.slice(2);

// Handle API key clearing
if (args.includes("--clear-api-key")) {
    clearApiKey();
    process.exit(0);
}

// Ensure API key is set before processing files
if (!getGeminiApiKey()) {
    console.log("⚠️ Please set up your Gemini API key first by running:");
    console.log("node src/config.js");
    process.exit(1);
}

// Process file if a file path is provided
const filePath = args[0];
if (!filePath) {
  console.error("❌ Please provide a file to analyze.");
  process.exit(1);
}

processFile(filePath);
