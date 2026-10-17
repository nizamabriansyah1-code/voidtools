# VOIDTOOLS

**ALL YOUR TOOLS. ONE VOID.**

A privacy-minded collection of 20 browser-side utilities for developers, Minecraft server owners, and creative work.

## Run locally

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Commands

- `npm run lint` — ESLint
- `npm run typecheck` — strict TypeScript check
- `npm test` — Node's built-in tests for core tool logic
- `npm run build` — optimized production build
- `npm start` — serve the production build

## Routes

- `/` — dashboard, featured tools, favorites, and recent tools
- `/tools` — searchable directory with category filters
- `/tools/[slug]` — a dedicated page for each utility
- `/download` — Android APK and Windows app downloads
- `/about` — project and privacy information

Favorites and recently used tools are stored in local storage. Tool calculations run in the browser; SHA-256 and secure generators use the Web Crypto API. QR code generation uses the local `qrcode` package.

## Android app

VOIDTOOLS can be packaged as an offline Android app with Capacitor. Install Android Studio and the Android SDK, then run:

```bash
npm ci
npm run android:apk
```

The debug APK is written to `android/app/build/outputs/apk/debug/app-debug.apk` and can be shared for sideloading. Opening the Android project in Android Studio is also supported with `npx cap open android`.

## Windows app

Build the portable Windows app with:

```bash
npm ci
npm run windows:exe
```

The app is written to `outputs/windows-build/VOIDTOOLS-Windows-1.0.0.exe`.

## GitHub Pages and app releases

The `.github/workflows/pages.yml` workflow builds the static site and deploys it to GitHub Pages when code is pushed to `main`. The repository must enable GitHub Actions as the Pages source. Android and Windows binaries belong in a GitHub Release, not in the repository. Attach files named `VOIDTOOLS-android.apk` and `VOIDTOOLS-Windows.exe`; the download page links to the latest release automatically.

To make the Pages URLs work under a project repository path, the workflow sets the base path from the repository name. A public repository is required when using GitHub Free.
