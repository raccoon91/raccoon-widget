import { join } from "path";
import { app, shell, BrowserWindow } from "electron";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";

import widget from "@/main/lib/widget";
import { appIpcHandler } from "@/main/ipc/app.ipc";
import { bluetoothIpcHandler } from "@/main/ipc/bluetooth.ipc";
import { widgetIpcHandler } from "@/main/ipc/widget.ipc";
import icon from "@resources/icon.png?asset";

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    show: false,
    icon,
    frame: false,
    transparent: true,
    hasShadow: false,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  appIpcHandler(mainWindow);

  bluetoothIpcHandler();

  widgetIpcHandler(mainWindow);

  mainWindow.setMenu(null);

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();

    // Prevent BrowserWindow from being hidden in AeroPeek.
    widget.preventFromAeroPeek(mainWindow);

    // Prevent BrowserWindow from being hidden in ShowDesktop.
    widget.preventFromShowDesktop(mainWindow);

    // Move BrowserWindow to the bottom of the windows
    widget.moveToBottom(mainWindow);
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);

    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.raccoon-widget");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
