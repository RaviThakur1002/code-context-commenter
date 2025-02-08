
import { initializeGemini } from "./config.js";
import inquirer from "inquirer";
import readlineSync from "readline-sync"; // Import readline-sync

const DEFAULT_PROMPT = `You are a helpful code documentation assistant.
Your task is to add useful inline comments to the given JavaScript code.
- Explain functions, loops, and important logic clearly.
- Maintain proper formatting, keeping comments right above the relevant code blocks.
- Do NOT change the code, only add comments.`;

const PROMPT_STYLES = {
    DEFAULT: 'default',
    CUSTOM: 'custom',
    LINE_SPECIFIC: 'line-specific'
};

async function getCommentPreferences(code) {
    const questions = [
        {
            type: 'list',
            name: 'promptStyle',
            message: 'How would you like to comment the code?',
            choices: [
                { name: 'Use default commenting style', value: PROMPT_STYLES.DEFAULT },
                { name: 'Provide custom instructions', value: PROMPT_STYLES.CUSTOM },
                { name: 'Comment specific lines', value: PROMPT_STYLES.LINE_SPECIFIC }
            ]
        }
    ];

    const { promptStyle } = await inquirer.prompt(questions);

    // ✅ Use readline-sync for direct input instead of opening an editor
    if (promptStyle === PROMPT_STYLES.CUSTOM) {
        const customPrompt = readlineSync.question(
            "Enter your custom commenting instructions: "
        );
        return { style: PROMPT_STYLES.CUSTOM, prompt: customPrompt };
    }

    if (promptStyle === PROMPT_STYLES.LINE_SPECIFIC) {
        const lines = code.split('\n');
        console.log('\nCode lines:');
        lines.forEach((line, index) => {
            console.log(`${index + 1}: ${line}`);
        });

        const startLine = readlineSync.questionInt("Enter start line number: ");
        const endLine = readlineSync.questionInt("Enter end line number: ");
        const instructions = readlineSync.question(
            "Enter specific instructions for these lines: ",
            { defaultInput: "Please explain what this code section does" }
        );

        return {
            style: PROMPT_STYLES.LINE_SPECIFIC,
            startLine: startLine - 1,
            endLine: endLine - 1,
            instructions
        };
    }

    return { style: PROMPT_STYLES.DEFAULT, prompt: DEFAULT_PROMPT };
}

export async function generateComments(code) {
    const model = await initializeGemini();
    const preferences = await getCommentPreferences(code);

    let promptText;
    let codeToComment = code;

    switch (preferences.style) {
        case PROMPT_STYLES.CUSTOM:
            promptText = `${preferences.prompt}\n\nHere is the code:\n\`\`\`js\n${code}\n\`\`\``;
            break;

        case PROMPT_STYLES.LINE_SPECIFIC:
            const lines = code.split('\n');
            const selectedLines = lines
                .slice(preferences.startLine, preferences.endLine + 1)
                .join('\n');
            
            promptText = `${DEFAULT_PROMPT}\n
            Additional instructions: ${preferences.instructions}\n
            Focus on these specific lines:\n\`\`\`js\n${selectedLines}\n\`\`\``;
            codeToComment = selectedLines;
            break;

        default:
            promptText = `${DEFAULT_PROMPT}\n\nHere is the code:\n\`\`\`js\n${code}\n\`\`\``;
    }

    try {
        const result = await model.generateContent(promptText);
        
        if (!result || !result.response) {
            throw new Error('Invalid response from Gemini API');
        }

        const response = result.response.text();
        const cleanedResponse = response.replace(/```(?:js|javascript)?\n([\s\S]*?)```/g, '$1').trim();

        if (preferences.style === PROMPT_STYLES.LINE_SPECIFIC) {
            const lines = code.split('\n');
            lines.splice(
                preferences.startLine, 
                preferences.endLine - preferences.startLine + 1, 
                cleanedResponse
            );
            return lines.join('\n');
        }

        return cleanedResponse;

    } catch (error) {
        console.error("❌ Error generating comments:", error);
        throw error;
    }
}
