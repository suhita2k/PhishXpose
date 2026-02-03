# 🛡️ PhishXpose - AI Phishing Detection System

A web-based phishing attack detection system with AI & real-time alerts.

![PhishXpose](https://img.shields.io/badge/PhishXpose-Cybersecurity-00ff88?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)

---

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

### 1. Node.js (v18 or higher)
Download and install from: https://nodejs.org/

To verify installation, open terminal and run:
```bash
node --version
npm --version
```

### 2. VS Code
Download and install from: https://code.visualstudio.com/

### 3. Recommended VS Code Extensions
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **Prettier - Code formatter**
- **TypeScript Vue Plugin (Volar)**

---

## 🚀 How to Run in VS Code

### Step 1: Create Project Folder

Open your terminal (Command Prompt, PowerShell, or Terminal) and run:

```bash
# Create a new folder for the project
mkdir phishxpose
cd phishxpose
```

### Step 2: Initialize the Project

```bash
# Create a new Vite + React + TypeScript project
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install

# Install additional packages
npm install react-router-dom recharts lucide-react
```

### Step 3: Open in VS Code

```bash
# Open the project in VS Code
code .
```

Or manually:
1. Open VS Code
2. Click `File` → `Open Folder`
3. Select the `phishxpose` folder

### Step 4: Copy Project Files

Replace the default files with the PhishXpose source code:

1. Replace `src/App.tsx` with the PhishXpose App component
2. Replace `src/index.css` with the PhishXpose styles
3. Add all component files in `src/components/`
4. Add all page files in `src/pages/`
5. Add context files in `src/context/`
6. Add type files in `src/types/`
7. Add utility files in `src/utils/`

### Step 5: Run Development Server

Open the integrated terminal in VS Code:
- Press `` Ctrl + ` `` (backtick) or
- Click `Terminal` → `New Terminal`

Then run:

```bash
npm run dev
```

### Step 6: View in Browser

The terminal will show:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

**Click the link** or open your browser and go to:
```
http://localhost:5173
```

---

## 📁 Project Structure

```
phishxpose/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── UrlScanner.tsx
│   │   ├── EmailScanner.tsx
│   │   ├── ResultDisplay.tsx
│   │   ├── AlertPopup.tsx
│   │   └── LanguageSwitcher.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Admin.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── History.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── LanguageContext.tsx
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── phishingDetector.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🔐 Demo Credentials

### Admin Account
- **Email:** admin@phishxpose.com
- **Password:** admin123

### Regular User
- Register a new account through the signup page

---

## 🧪 Test URLs

Try these URLs to test the detection:

| URL | Expected Result |
|-----|-----------------|
| `https://google.com` | ✅ Safe |
| `https://amazon.com` | ✅ Safe |
| `https://secure-paypa1.com/login` | 🔴 Phishing |
| `https://amaz0n-verify.tk/account` | 🔴 Phishing |
| `https://login-banking.xyz` | 🟡 Suspicious |
| `http://192.168.1.1/login` | 🔴 Phishing |

---

## 🛠️ Troubleshooting

### Error: 'npm' is not recognized
- Make sure Node.js is installed
- Restart VS Code after installing Node.js
- Add Node.js to your system PATH

### Error: Port 5173 already in use
```bash
# Kill the process using the port (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- --port 3000
```

### Error: Module not found
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Tailwind CSS not working
Make sure `tailwind.config.js` has the correct content paths:
```js
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
```

---

## 🌐 Building for Production

```bash
# Build the project
npm run build

# Preview the build locally
npm run preview
```

The production files will be in the `dist/` folder.

---

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors (F12)
2. Check the terminal for build errors
3. Make sure all dependencies are installed

---

## 📄 License

MIT License - Feel free to use this project for learning and development.

---

**Built with ❤️ for Cybersecurity Education**