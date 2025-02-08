import { initializeGemini } from "./config.js";
import inquirer from "inquirer";
import readlineSync from "readline-sync";

const DEFAULT_PROMPT = `You are a helpful code documentation assistant.
Your task is to add useful comments to the given JavaScript code.
IMPORTANT:
- DO NOT modify any of the existing code
- Only add comments above the relevant code sections
- Preserve all existing code formatting and structure exactly as is
- If there are existing comments, preserve them and add your comments alongside
- Focus on explaining what the code does in a clear, concise way`;

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

    switch (preferences.style) {
        case PROMPT_STYLES.CUSTOM:
            promptText = `${preferences.prompt}\n\nCode to comment:\n\`\`\`javascript\n${code}\n\`\`\``;
            break;

        case PROMPT_STYLES.LINE_SPECIFIC:
            const lines = code.split('\n');
            const codeContext = lines.join('\n');
            const selectedLines = lines
                .slice(preferences.startLine, preferences.endLine + 1)
                .join('\n');
            
            promptText = `${DEFAULT_PROMPT}\n
            Additional instructions: ${preferences.instructions}\n
            Here is the full code for context:\n\`\`\`javascript\n${codeContext}\n\`\`\`\n
            Please focus on commenting these specific lines:\n\`\`\`javascript\n${selectedLines}\n\`\`\``;
            break;

        default:
            promptText = `${DEFAULT_PROMPT}\n\nCode to comment:\n\`\`\`javascript\n${code}\n\`\`\``;
    }

    try {
        const result = await model.generateContent(promptText);
        
        if (!result || !result.response) {
            throw new Error('Invalid response from Gemini API');
        }

        const response = result.response.text();
        // Extract just the code part from the response
        const commentedCode = response.replace(/```(?:js|javascript)?\n([\s\S]*?)```/g, '$1').trim();
        
        if (preferences.style === PROMPT_STYLES.LINE_SPECIFIC) {
            // For line-specific comments, merge the AI's comments with the original code
            const lines = code.split('\n');
            const commentedLines = commentedCode.split('\n');
            lines.splice(preferences.startLine, 
                        preferences.endLine - preferences.startLine + 1, 
                        ...commentedLines);
            return lines.join('\n');
        }

        return commentedCode;
    } catch (error) {
        console.error("❌ Error generating comments:", error);
        throw error;
    }
}
