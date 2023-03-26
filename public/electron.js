const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

function createWindow() {
  const win = new BrowserWindow({
    title: "FireChat",
    webPreferences: {
      preload: path.join(__dirname, "preloader.js"),
    },
  });
  win.maximize();
  win.setMenu(null);
  win.loadURL(
    isDev
      ? "http:localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  win.on("page-title-updated", function (e) {
    e.preventDefault();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("active", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
