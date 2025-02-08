import Configstore from "configstore";
import inquirer from "inquirer";
import { GoogleGenerativeAI } from "@google/generative-ai";

const config = new Configstore("code-commenter");

export async function initializeGemini() {
    let apiKey = config.get("geminiApiKey");
    if (!apiKey) {
        const answers = await inquirer.prompt([{
            type: "input",
            name: "apiKey",
            message: "Enter your Gemini API key:",
            validate: input => input.length > 0 ? true : "Please enter a valid API key"
        }]);
        apiKey = answers.apiKey;
        config.set("geminiApiKey", apiKey);
        console.log("✅ Gemini API key saved");
    }
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent('Test connection');
        const response = await result.response;
        if (response) {
            console.log("✅ Gemini connection test successful");
            return model;
        }
    } catch (error) {
        console.error("❌ Gemini connection test failed:", error);
        config.delete("geminiApiKey");
        return initializeGemini();
    }
}

export function getGeminiApiKey() {
    return config.get("geminiApiKey");
}

export function clearApiKey() {
    config.delete("geminiApiKey");
    console.log("✅ Gemini API key cleared");
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const action = process.argv[2];
    if (action === "--clear") {
        clearApiKey();
    } else {
        initializeGemini().catch(console.error);
    }
}
