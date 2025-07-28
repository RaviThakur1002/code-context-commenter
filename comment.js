#!/usr/bin/env node

import { processFile } from "./src/index.js";
import { initializeGemini } from "./src/config.js";

// This immediately runs the API key setup if it's not present.
await initializeGemini();

const filePath = process.argv[2];

if (!filePath) {
    console.error("❌ Please provide a file path to process.");
    console.log("Usage: node comment.js <path/to/your/file.js>");
    process.exit(1);
}

// Now, process the file with the guaranteed API key.
processFile(filePath);
