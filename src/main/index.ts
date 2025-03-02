import { join } from "path";
import { app, BrowserWindow } from "electron";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";

import { APP } from "@/constants/app";
import { APP_IPC } from "@/constants/ipc";
import config from "@/main/lib/config";
import storage from "@/main/lib/storage";
import widget from "@/main/lib/widget";
import log from "@/main/lib/log";
import { appIpcHandler } from "@/main/ipc/app.ipc";
import { appChildIpcHandler } from "@/main/ipc/app-child.ipc";
import { storageIpcHandler } from "@/main/ipc/storage.ipc";
import { widgetIpcHandler } from "@/main/ipc/widget.ipc";
import { bluetoothIpcHandler } from "@/main/ipc/bluetooth.ipc";
import icon from "@resources/icon.png?asset";

// function createBluetoothWindow(
//   name: string,
// ): [{ name: string; window: BrowserWindow }, (mainWindow: BrowserWindow) => void] {
//   const path = new URL("/bluetooth").pathname;
//   const setting = config.getChild(path);

//   const bluetoothWindow = new BrowserWindow({
//     show: false,
//     icon,
//     frame: false,
//     transparent: true,
//     hasShadow: false,
//     fullscreenable: false,
//     titleBarStyle: "hidden",
//     width: setting.width,
//     height: setting.height,
//     x: setting.x,
//     y: setting.y,
//     webPreferences: {
//       preload: join(__dirname, "../preload/index.js"),
//       sandbox: false,
//     },
//   });

//   bluetoothWindow.setMenu(null);

//   bluetoothWindow.on("ready-to-show", () => {
//     // Prevent BrowserWindow from being hidden in AeroPeek.
//     widget.preventFromAeroPeek(bluetoothWindow);

//     // Prevent BrowserWindow from being hidden in ShowDesktop.
//     widget.preventFromShowDesktop(bluetoothWindow);

//     // Move BrowserWindow to the bottom of the windows
//     // widget.moveToBottom(bluetoothWindow);
//   });

//   if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
//     bluetoothWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
//   } else {
//     bluetoothWindow.loadFile(join(__dirname, "../renderer/index.html"));
//   }

//   return [
//     { name, window: bluetoothWindow },
//     (mainWindow: BrowserWindow) => {
//       bluetoothWindow.setParentWindow(mainWindow);

//       appChildIpcHandler(name, bluetoothWindow);
//       storageIpcHandler(name, bluetoothWindow);

//       bluetoothWindow.webContents.on("devtools-opened", () => {
//         bluetoothWindow.webContents.send(APP_IPC.DEVTOOLS_STATUS_CHAGEND, true);
//       });

//       bluetoothWindow.webContents.on("devtools-closed", () => {
//         bluetoothWindow.webContents.send(APP_IPC.DEVTOOLS_STATUS_CHAGEND, false);
//       });
//     },
//   ];
// }

function createWindow(): [BrowserWindow, (children?: BrowserWindow[]) => void] {
  const setting = config.get();

  const mainWindow = new BrowserWindow({
    show: false,
    icon,
    frame: false,
    transparent: true,
    hasShadow: false,
    titleBarStyle: "hidden",
    width: setting?.width ?? APP.APP_DEFAULT_WIDTH,
    height: setting?.height ?? APP.APP_DEFAULT_HEIGHT,
    x: setting?.x ?? APP.APP_DEFAULT_POSITION_X,
    y: setting?.y ?? APP.APP_DEFAULT_POSITION_Y,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

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

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (!url) return { action: "deny" };

    const path = new URL(url).pathname;
    const setting = config.getChild(path);

    return {
      action: "allow",
      overrideBrowserWindowOptions: {
        icon,
        frame: false,
        transparent: true,
        hasShadow: false,
        fullscreenable: false,
        titleBarStyle: "hidden",
        parent: mainWindow,
        width: setting.width,
        height: setting.height,
        x: setting.x,
        y: setting.y,
        webPreferences: {
          preload: join(__dirname, "../preload/index.js"),
          sandbox: false,
        },
      },
    };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  return [
    mainWindow,
    (children?: BrowserWindow[]) => {
      appIpcHandler(mainWindow);
      appChildIpcHandler(mainWindow);
      storageIpcHandler(mainWindow);
      widgetIpcHandler(mainWindow);
      bluetoothIpcHandler();

      mainWindow.webContents.on("devtools-opened", () => {
        mainWindow.webContents.send(APP_IPC.DEVTOOLS_STATUS_CHAGEND, true);
      });

      mainWindow.webContents.on("devtools-closed", () => {
        mainWindow.webContents.send(APP_IPC.DEVTOOLS_STATUS_CHAGEND, false);
      });
    },
  ];
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

  const [mainWindow, mainWindowIpc] = createWindow();
  // const [bluetoothWindow, bluetoothWindowIpc] = createBluetoothWindow(APP_CHILD_PATH.BLUETOOTH_PATH);

  mainWindowIpc();
  // bluetoothWindowIpc(mainWindow);

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("before-quit", () => {
  // Object.values(APP_IPC).forEach((channel) => {
  //   ipcMain.removeAllListeners(channel);
  // });

  config.save();
  storage.save();
  log.end();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
