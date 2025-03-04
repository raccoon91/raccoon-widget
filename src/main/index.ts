import { app, BrowserWindow } from "electron";
import { electronApp, optimizer } from "@electron-toolkit/utils";

import { APP_NAME } from "@/constants/app-name";
import config from "@/main/lib/config";
import storage from "@/main/lib/storage";
import log from "@/main/lib/log";
import { createWindow } from "@/main/window/main";
import { createBluetoothWindow } from "@/main/window/bluetooths";

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

  const [mainWindow, mainWindowIpc] = createWindow(APP_NAME.MAIN);
  const [bluetoothWindow, bluetoothWindowIpc] = createBluetoothWindow(APP_NAME.BLUETOOTH);

  mainWindowIpc([bluetoothWindow]);
  bluetoothWindowIpc(mainWindow);

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow(APP_NAME.MAIN);
  });
});

app.on("before-quit", () => {
  config.save();
  storage.save();
  log.end();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
