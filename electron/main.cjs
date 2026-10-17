const { app, BrowserWindow, shell } = require("electron");
const { createServer } = require("node:http");
const { readFile, stat } = require("node:fs/promises");
const path = require("node:path");

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8", ".html": "text/html; charset=utf-8", ".ico": "image/x-icon",
  ".jpeg": "image/jpeg", ".jpg": "image/jpeg", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8", ".webp": "image/webp", ".woff2": "font/woff2",
};

const webRoot = app.isPackaged
  ? path.join(process.resourcesPath, "web")
  : path.resolve(__dirname, "..", "out");

async function findFile(urlPath) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(urlPath.split("?")[0]);
  } catch {
    return null;
  }

  const requestedPath = path.resolve(webRoot, decodedPath.replace(/^\/+/, ""));
  if (requestedPath !== webRoot && !requestedPath.startsWith(`${webRoot}${path.sep}`)) return null;

  const candidates = [requestedPath];
  if (!path.extname(requestedPath)) candidates.push(`${requestedPath}.html`, path.join(requestedPath, "index.html"));
  for (const candidate of candidates) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {
      // Try the next static-export route candidate.
    }
  }
  return null;
}

let server;

async function createWindow() {
  server = createServer(async (request, response) => {
    const filePath = await findFile(request.url || "/");
    if (!filePath) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
    try {
      const content = await readFile(filePath);
      response.writeHead(200, {
        "Content-Type": MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-store",
      });
      response.end(content);
    } catch {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Unable to load this page");
    }
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  const window = new BrowserWindow({
    width: 1440, height: 920, minWidth: 760, minHeight: 600,
    backgroundColor: "#08090d", autoHideMenuBar: true, title: "VOIDTOOLS",
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://") || url.startsWith("http://")) shell.openExternal(url);
    return { action: "deny" };
  });
  window.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith(`http://127.0.0.1:${address.port}/`)) event.preventDefault();
  });
  await window.loadURL(`http://127.0.0.1:${address.port}/`);
}

app.whenReady().then(createWindow);
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
app.on("window-all-closed", () => {
  server?.close();
  if (process.platform !== "darwin") app.quit();
});
