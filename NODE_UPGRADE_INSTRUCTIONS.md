# Node.js Upgrade Instructions

## Issue
Your current Node.js version (v12.13.0) is too old for Vite 5, which requires Node.js 18 or higher.

## Solution: Upgrade Node.js

### Option 1: Using Homebrew (Recommended for macOS)

1. **Install or update Homebrew:**
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install the latest Node.js:**
   ```bash
   brew install node
   ```

3. **Verify installation:**
   ```bash
   node --version
   ```
   Should show v18.x.x or higher

### Option 2: Using NVM (Node Version Manager)

1. **Install NVM:**
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```

2. **Reload your shell:**
   ```bash
   source ~/.zshrc
   ```

3. **Install Node.js 18 (LTS):**
   ```bash
   nvm install 18
   nvm use 18
   nvm alias default 18
   ```

4. **Verify installation:**
   ```bash
   node --version
   ```

### Option 3: Download from Node.js Website

1. Visit: https://nodejs.org/
2. Download the LTS version (v18 or v20)
3. Install the .pkg file
4. Restart your terminal

## After Upgrading

1. **Remove old node_modules:**
   ```bash
   rm -rf node_modules package-lock.json
   ```

2. **Reinstall dependencies:**
   ```bash
   npm install
   ```

3. **Start the dev server:**
   ```bash
   npm run dev
   ```

## Verify

After upgrading, run:
```bash
node --version
```

You should see v18.x.x or higher.

