
# 🚀 Code Commenter

A **CLI tool** that automatically generates **intelligent comments** for your JavaScript code using Google's **Gemini AI**.

---

## 📌 Prerequisites

Ensure you have the following installed before using Code Commenter:

- **Node.js** (Version **16** or higher)
- **npm** (Node Package Manager)
- **Google Cloud Account** with **Gemini API** access
- **Gemini API Key**

---

## 📥 Installation

```bash
# Clone the repository
git clone https://github.com/RaviThakur1002/code-context-commenter

# Navigate to the project directory
cd code-context-commenter

# Install dependencies
npm install

# Link the package globally (Linux/macOS)
npm link

# For Windows, use:
powershell -Command "npm link"
```

---

## 🔑 Configure API Key

Before using the tool, set up your **Gemini API key**:

```bash
node src/config.js
```

When prompted, enter your **Gemini API Key**. It will be securely stored using **Configstore**.

To **reset/clear** your API key at any time:
```bash
node src/config.js --clear
```

---

## 🚀 Usage

### 🏃 Basic Command
```bash
code-commenter path/to/your/file.js
```

### 🎛 Interactive Commenting Options
When running the tool, you'll be presented with three commenting styles:

1️⃣ **Default Style** → Uses predefined best-practice commenting guidelines.
2️⃣ **Custom Instructions** → Allows you to provide specific commenting instructions.
3️⃣ **Line-specific Comments** → Lets you focus on commenting specific sections of code.

---

## 📂 Project Structure

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

---

## 🛠 Package.json Configuration

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

---

## 📦 Dependencies

| Package                  | Purpose                                      |
|--------------------------|----------------------------------------------|
| **@google/generative-ai** | Google's Generative AI SDK for Gemini       |
| **configstore**          | Secure storage for API keys                  |
| **inquirer**             | Interactive CLI user prompts                 |
| **readline-sync**        | Synchronous CLI input handling               |

---

## 🛠 Troubleshooting

### 🔑 API Key Issues
- If you receive an API key warning, run:
  ```bash
  node src/config.js
  ```
- If the key is invalid, the tool will prompt you to enter it again.

### 🔒 Permission Issues
```bash
# If you get permission errors, try:
sudo npm link  # For Unix-based systems
```
- On Windows, **run PowerShell as Administrator** and retry:
  ```powershell
  npm link
  ```

### 📦 Module Not Found Errors
- Ensure you have installed all dependencies:
  ```bash
  npm install
  ```
- Check that you are using **Node.js 16 or higher**.

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

💡 **Enhance your code with AI-powered comments effortlessly!** 🚀

