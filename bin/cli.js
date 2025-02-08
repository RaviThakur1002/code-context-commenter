#!/usr/bin/env node
import { processFile } from '../src/index.js';
import { getGeminiApiKey } from '../src/config.js';

if (!getGeminiApiKey()) {
    console.log("⚠️ Please set up your Gemini API key first by running:");
    console.log("node src/config.js");
    process.exit(1);
}

const filePath = process.argv[2];
if (!filePath) {
  console.error("❌ Please provide a file to analyze.");
  process.exit(1);
}

processFile(filePath);
