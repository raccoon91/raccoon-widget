import { BrowserWindow, ipcMain } from "electron";

import { APP_IPC } from "@/constants/ipc";

export const appIpcHandler = (browserWindow: BrowserWindow) => {
  ipcMain.handle(APP_IPC.MINIMIZE_WINDOW, async () => {
    if (browserWindow.isMinimizable()) {
      browserWindow.minimize();
    }
  });

  ipcMain.handle(APP_IPC.MAXIMIZE_WINDOW, async () => {
    if (browserWindow.isMaximizable()) {
      browserWindow.maximize();
    }
  });

  ipcMain.handle(APP_IPC.IS_DEV_TOOLS_OPENED, async () => {
    return browserWindow.webContents.isDevToolsOpened();
  });

  ipcMain.handle(APP_IPC.OPEN_DEV_TOOLS, async () => {
    if (!browserWindow.webContents.isDevToolsOpened()) {
      browserWindow.webContents.openDevTools({ mode: "detach" });
    }
  });

  ipcMain.handle(APP_IPC.CLOSE_DEV_TOOLS, async () => {
    if (browserWindow.webContents.isDevToolsOpened()) {
      browserWindow.webContents.closeDevTools();
    }
  });

  ipcMain.handle(APP_IPC.CLOSE_WINDOW, async () => {
    if (browserWindow.isClosable()) {
      browserWindow.close();
    }
  });
};
