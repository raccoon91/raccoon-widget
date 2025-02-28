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

  ipcMain.handle(APP_IPC.GET_APP_CHILD_CONFIG, (_, path: string) => {
    try {
      const result = config.getChild(path);

      log.info("APP_IPC GET_APP_CHILD_CONFIG");

      return result;
    } catch (error) {
      log.error(error);

      return null;
    }
  });

  ipcMain.handle(APP_IPC.SET_APP_CHILD_CONFIG, (_, path: string, data?: Record<string, number>) => {
    try {
      config.setChild(path, data);

      const childWindows = browserWindow.getChildWindows();

      const child = childWindows.find((window) => {
        const url = new URL(window.webContents.getURL());

        return url.pathname === path;
      });

      child?.webContents.on("devtools-opened", () => {
        child.webContents.send(APP_IPC.CHILD_DEVTOOLS_STATUS_CHAGEND, true);
      });

      child?.webContents.on("devtools-closed", () => {
        child.webContents.send(APP_IPC.CHILD_DEVTOOLS_STATUS_CHAGEND, false);
      });

      log.info("APP_IPC SET_APP_CHILD_CONFIG");
    } catch (error) {
      log.error(error);
    }
  });

  ipcMain.handle(APP_IPC.OPEN_CHILD_DEV_TOOLS, async (_, path: string) => {
    try {
      const childWindows = browserWindow.getChildWindows();

      const child = childWindows.find((window) => {
        const url = new URL(window.webContents.getURL());

        return url.pathname === path;
      });

      if (!child?.webContents.isDevToolsOpened()) {
        child?.webContents.openDevTools({ mode: "detach" });

        log.info("APP_IPC OPEN_CHILD_DEV_TOOLS");
      }
    } catch (error) {
      log.error(error);
    }
  });

  ipcMain.handle(APP_IPC.CLOSE_CHILD_DEV_TOOLS, async (_, path: string) => {
    try {
      const childWindows = browserWindow.getChildWindows();

      const child = childWindows.find((window) => {
        const url = new URL(window.webContents.getURL());

        return url.pathname === path;
      });

      if (child?.webContents.isDevToolsOpened()) {
        child?.webContents.closeDevTools();

        log.info("APP_IPC CLOSE_CHILD_DEV_TOOLS");
      }
    } catch (error) {
      log.error(error);
    }
  });

  ipcMain.handle(APP_IPC.CLOSE_CHILD_WINDOW, async (_, path: string) => {
    try {
      const childWindows = browserWindow.getChildWindows();

      const child = childWindows.find((window) => {
        const url = new URL(window.webContents.getURL());

        return url.pathname === path;
      });

      if (child?.isClosable()) {
        child.webContents.removeAllListeners("devtools-opened");
        child.webContents.removeAllListeners("devtools-closed");

        child.close();

        log.info("APP_IPC CLOSE_CHILD_WINDOW");
      }
    } catch (error) {
      log.error(error);
    }
  });
};
