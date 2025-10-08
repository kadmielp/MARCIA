# M.A.R.C.I.A - Native Windows App Build Instructions

## Prerequisites

Before building the app, you need to install:

### 1. Node.js
- Download and install from: https://nodejs.org/
- Choose the LTS (Long Term Support) version
- Verify installation: `node --version` and `npm --version`

### 2. Rust
- Download and install from: https://www.rust-lang.org/tools/install
- Run the installer: `rustup-init.exe`
- Follow the prompts and restart your terminal
- Verify installation: `rustc --version` and `cargo --version`

### 3. Visual Studio C++ Build Tools (Required for Windows)
- Download from: https://visualstudio.microsoft.com/visual-cpp-build-tools/
- Install "Desktop development with C++" workload
- Or install the full Visual Studio with C++ support

### 4. WebView2 (Usually already installed on Windows 10/11)
- If needed, download from: https://developer.microsoft.com/en-us/microsoft-edge/webview2/

## Build Instructions

### Step 1: Install Dependencies

Open PowerShell or Command Prompt in the project directory:

```bash
cd "C:\Users\micro\Downloads\AI\Vibing\Artifacts\Marcia"
npm install
```

### Step 2: Run in Development Mode

To test the app without building:

```bash
npm run dev
```

This will open the app in a native window where you can test all functionality.

### Step 3: Build the Windows Installer

To create the final `.exe` and installer:

```bash
npm run build
```

The installer will be created in:
```
src-tauri\target\release\bundle\msi\
```

You'll find:
- `MARCIA_1.0.0_x64_en-US.msi` - Windows installer
- `marcia.exe` - Standalone executable in `src-tauri\target\release\`

## Distribution

The `.msi` installer can be distributed to other Windows users. They only need:
- Windows 10/11 (with WebView2, which is usually pre-installed)
- No Node.js, Rust, or development tools required!

## App Features

Your native M.A.R.C.I.A app includes:
- ✅ Native Windows window with custom icon
- ✅ No browser chrome (feels like a real desktop app)
- ✅ All web features (React, Tailwind, Lucide icons)
- ✅ HTTP access for AI API calls
- ✅ Resizable window (800x600 minimum, 1000x800 default)
- ✅ Small file size (~5-10 MB)
- ✅ Fast startup

## Configuration

Edit `src-tauri/tauri.conf.json` to customize:
- Window size and title
- App version and identifier
- Bundle settings
- Security permissions

## Troubleshooting

### "cargo not found"
- Make sure Rust is installed
- Restart your terminal after installation
- Add Rust to PATH: `%USERPROFILE%\.cargo\bin`

### Build errors about missing tools
- Install Visual Studio Build Tools with C++ support
- Restart terminal after installation

### WebView2 errors
- Update Windows
- Manually install WebView2 Runtime

### Icons not showing
- Ensure `favicon.ico` exists in `src-tauri/icons/`
- Icon must be a valid `.ico` file with multiple resolutions

## Next Steps

1. Test the app with `npm run dev`
2. Build the installer with `npm run build`
3. Install the `.msi` file to test the final product
4. Share the installer with users!

Enjoy your native M.A.R.C.I.A app! 🎉

