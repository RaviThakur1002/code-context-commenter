# Code Commenter

A CLI tool that automatically generates intelligent comments for your JavaScript code using Google's Gemini AI.

## Prerequisites

- Node.js (version 16 or higher)
- npm (Node Package Manager)
- A Google Cloud account with access to the Gemini API
- Gemini API key

## Installation

### 1. Install the Package

There are two ways to install the package:

#### Option A: Install from npm (Recommended)
```bash
npm install -g code-commenter
```

#### Option B: Install from source
```bash
# Clone the repository
git clone https://github.com/RaviThakur1002/code-context-commenter

# Navigate to the project directory
cd code-commenter

# Install dependencies
npm install

# Link the package globally
npm link
```

### 2. Configure API Key

Before using the tool, you need to set up your Gemini API key:

```bash
node src/config.js
```

When prompted, enter your Gemini API key. The key will be securely stored using Configstore.

To clear your API key at any time:
```bash
node src/config.js --clear
```

## Usage

### Basic Usage
```bash
code-commenter path/to/your/file.js
```

### Interactive Options

When running the tool, you'll be presented with three commenting styles:

1. **Default Style**: Uses predefined commenting guidelines
2. **Custom Instructions**: Allows you to provide specific commenting instructions
3. **Line-specific Comments**: Lets you focus on commenting specific sections of code

## Project Structure

```
code-commenter/
├── bin/
│   └── cli.js          # Command-line interface entry point
├── src/
│   ├── index.js        # Main application logic
│   ├── parser.js       # Code parsing utilities
│   ├── commentor.js    # Comment generation logic
│   └── config.js       # Configuration management
├── package.json
└── Installation.md
```

## Package.json Configuration

```json
{
  "name": "code-commenter",
  "version": "1.0.0",
  "type": "module",
  "main": "src/index.js",
  "bin": {
    "code-commenter": "./bin/cli.js"
  },
  "scripts": {
    "start": "node bin/cli.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "@google/generative-ai": "^0.1.3",
    "configstore": "^6.0.0",
    "inquirer": "^9.2.7",
    "readline-sync": "^1.4.10"
  }
}
```

## Dependencies

- **@google/generative-ai**: Google's Generative AI SDK for Gemini
- **configstore**: For secure storage of API keys
- **inquirer**: Interactive command line interface
- **readline-sync**: Synchronous readline for command line input

## Troubleshooting

1. **API Key Issues**
   - If you get a warning about the API key, run `node src/config.js` to set it up
   - If the key is invalid, the tool will automatically prompt you to enter it again

2. **Permission Issues**
   ```bash
   # If you get permission errors, try:
   sudo npm link  # On Unix-based systems
   # Or run PowerShell as Administrator for Windows
   ```

3. **Module Not Found Errors**
   - Ensure you have all dependencies installed: `npm install`
   - Check that you're using Node.js version 16 or higher

## License

This project is licensed under the MIT License - see the LICENSE file for details.
