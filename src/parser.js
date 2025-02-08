export function extractCodeBlocks(content) {
    // Store meaningful code blocks
    let blocks = [];
    
    // Remove any existing comments to avoid confusion
    const noComments = content
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
        .replace(/\/\/.*/g, '');           // Remove single-line comments

    // Split code into logical blocks (functions, classes, etc.)
    const lines = noComments.split('\n');
    let currentBlock = [];
    let braceCount = 0;
    let inBlock = false;

    for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Skip empty lines outside blocks
        if (!inBlock && trimmedLine.length === 0) continue;
        
        // Count braces to track code blocks
        braceCount += (trimmedLine.match(/\{/g) || []).length;
        braceCount -= (trimmedLine.match(/\}/g) || []).length;
        
        // Start of a new block (function, class, etc.)
        if (!inBlock && (
            trimmedLine.startsWith('function') ||
            trimmedLine.startsWith('class') ||
            trimmedLine.includes('=>') ||
            trimmedLine.match(/\w+\s*\([^)]*\)\s*\{/)
        )) {
            inBlock = true;
        }
        
        if (inBlock) {
            currentBlock.push(line);
        }
        
        // End of block
        if (inBlock && braceCount === 0) {
            blocks.push(currentBlock.join('\n'));
            currentBlock = [];
            inBlock = false;
        }
    }
    
    // Handle any remaining code
    if (currentBlock.length > 0) {
        blocks.push(currentBlock.join('\n'));
    }
    
    return blocks.join('\n\n');
}
