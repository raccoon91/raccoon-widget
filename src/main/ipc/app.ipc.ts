import { BrowserWindow, ipcMain } from "electron";

import { APP_IPC } from "@/constants/ipc";
import config from "@/main/lib/config";
import log from "@/main/lib/log";

export const appIpcHandler = (browserWindow: BrowserWindow) => {
  ipcMain.handle(APP_IPC.GET_APP_CONFIG, () => {
    try {
      const result = config.get();

      log.info("APP_IPC GET_APP_CONFIG");

      return result;
    } catch (error) {
      log.error(error);

      return null;
    }
  });

  ipcMain.handle(APP_IPC.SET_APP_CONFIG, (_, data?: Record<string, number>) => {
    try {
      config.set(data);

      log.info("APP_IPC SET_APP_CONFIG");
    } catch (error) {
      log.error(error);
    }
  });

  ipcMain.handle(APP_IPC.MINIMIZE_WINDOW, async () => {
    try {
      if (browserWindow.isMinimizable()) {
        browserWindow.minimize();

        log.info("APP_IPC MINIMIZE_WINDOW");
      }
    } catch (error) {
      log.error(error);
    }
  });

  ipcMain.handle(APP_IPC.MAXIMIZE_WINDOW, async () => {
    try {
      if (browserWindow.isMaximizable()) {
        browserWindow.maximize();

        log.info("APP_IPC MAXIMIZE_WINDOW");
      }
    } catch (error) {
      log.error(error);
    }
  });

  ipcMain.handle(APP_IPC.OPEN_DEV_TOOLS, async () => {
    try {
      if (!browserWindow.webContents.isDevToolsOpened()) {
        browserWindow.webContents.openDevTools({ mode: "detach" });

        log.info("APP_IPC OPEN_DEV_TOOLS");
      }
    } catch (error) {
      log.error(error);
    }
  });

  ipcMain.handle(APP_IPC.CLOSE_DEV_TOOLS, async () => {
    try {
      if (browserWindow.webContents.isDevToolsOpened()) {
        browserWindow.webContents.closeDevTools();

        log.info("APP_IPC CLOSE_DEV_TOOLS");
      }
    } catch (error) {
      log.error(error);
    }
  });

  ipcMain.handle(APP_IPC.CLOSE_WINDOW, async () => {
    try {
      if (browserWindow.isClosable()) {
        browserWindow.close();

        log.info("APP_IPC CLOSE_WINDOW");
      }
    } catch (error) {
      log.error(error);
    }
  });
};
