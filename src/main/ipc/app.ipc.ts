import { BrowserWindow, ipcMain } from "electron";

import { APP_IPC } from "@/constants/ipc";
import { APP } from "@/constants/app";
import appConfig from "@/main/lib/app-config";

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

  ipcMain.handle(APP_IPC.GET_APP_CONFIG, () => {
    const result = appConfig.readFile(APP.APP_CONFIG_FILE_NAME);

    return result;
  });

  ipcMain.handle(APP_IPC.SET_APP_CONFIG, (_, data?: string) => {
    appConfig.writeFile(APP.APP_CONFIG_FILE_NAME, data);
  });
};
