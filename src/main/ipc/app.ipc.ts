import { BrowserWindow, ipcMain } from "electron";

import { APP_IPC } from "@/constants/ipc";
import config from "@/main/lib/config";
import log from "@/main/lib/log";

export const appIpcHandler = (browserWindow: BrowserWindow) => {
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

  ipcMain.handle(APP_IPC.IS_DEV_TOOLS_OPENED, async () => {
    try {
      log.info("APP_IPC IS_DEV_TOOLS_OPENED");

      return browserWindow.webContents.isDevToolsOpened();
    } catch (error) {
      log.error(error);

      return false;
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

  ipcMain.handle(APP_IPC.IS_CHILD_DEV_TOOLS_OPENED, async (_, path: string) => {
    try {
      const childWindows = browserWindow.getChildWindows();

      const child = childWindows.find((window) => {
        const url = new URL(window.webContents.getURL());

        return url.pathname === path;
      });

      log.info("APP_IPC IS_CHILD_DEV_TOOLS_OPENED");

      return child?.webContents.isDevToolsOpened();
    } catch (error) {
      log.error(error);

      return false;
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
        child.close();

        log.info("APP_IPC CLOSE_CHILD_WINDOW");
      }
    } catch (error) {
      log.error(error);
    }
  });

  ipcMain.handle(APP_IPC.GET_APP_CONFIG, () => {
    try {
      const result = config.read();

      log.info("APP_IPC GET_APP_CONFIG");

      return result;
    } catch (error) {
      log.error(error);

      return null;
    }
  });

  ipcMain.handle(APP_IPC.SET_APP_CONFIG, (_, data?: Record<string, number>) => {
    try {
      config.write(data);

      log.info("APP_IPC SET_APP_CONFIG");
    } catch (error) {
      log.error(error);
    }
  });
};
