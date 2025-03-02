import { BrowserWindow, ipcMain } from "electron";

import { APP_CHILD_IPC } from "@/constants/ipc";
import config from "@/main/lib/config";
import log from "@/main/lib/log";

export const appChildIpcHandler = (browserWindow: BrowserWindow) => {
  ipcMain.handle(APP_CHILD_IPC.OPEN_APP_CHILD_WINDOW, (_, path: string) => {
    const childWindows = browserWindow.getChildWindows();

    const child = childWindows.find((window) => {
      const url = new URL(window.webContents.getURL());

      return url.pathname === path;
    });

    if (!child) return;

    log.info("APP_CHILD_IPC OPEN_APP_CHILD_WINDOW");

    child.webContents.on("devtools-opened", () => {
      child.webContents.send(APP_CHILD_IPC.APP_CHILD_DEVTOOLS_STATUS_CHAGEND, true);
    });

    child.webContents.on("devtools-closed", () => {
      child.webContents.send(APP_CHILD_IPC.APP_CHILD_DEVTOOLS_STATUS_CHAGEND, false);
    });

    child.webContents.on("ipc-message", (event, channel) => {
      console.log(event, channel);
    });
  });

  ipcMain.handle(APP_CHILD_IPC.GET_APP_CHILD_CONFIG, (_, path: string) => {
    try {
      const result = config.getChild(path);

      log.info("APP_CHILD_IPC GET_APP_CHILD_CONFIG");

      return result;
    } catch (error) {
      log.error(error);

      return null;
    }
  });

  ipcMain.handle(APP_CHILD_IPC.SET_APP_CHILD_CONFIG, (_, path: string, data?: Record<string, number>) => {
    try {
      config.setChild(path, data);

      log.info("APP_CHILD_IPC SET_APP_CHILD_CONFIG");
    } catch (error) {
      log.error(error);
    }
  });

  ipcMain.handle(APP_CHILD_IPC.OPEN_APP_CHILD_DEV_TOOLS, async (_, path: string) => {
    try {
      const childWindows = browserWindow.getChildWindows();

      const child = childWindows.find((window) => {
        const url = new URL(window.webContents.getURL());

        return url.pathname === path;
      });

      if (!child?.webContents.isDevToolsOpened()) {
        child?.webContents.openDevTools({ mode: "detach" });

        log.info("APP_CHILD_IPC OPEN_APP_CHILD_DEV_TOOLS");
      }
    } catch (error) {
      log.error(error);
    }
  });

  ipcMain.handle(APP_CHILD_IPC.CLOSE_APP_CHILD_DEV_TOOLS, async (_, path: string) => {
    try {
      const childWindows = browserWindow.getChildWindows();

      const child = childWindows.find((window) => {
        const url = new URL(window.webContents.getURL());

        return url.pathname === path;
      });

      if (child?.webContents.isDevToolsOpened()) {
        child?.webContents.closeDevTools();

        log.info("APP_CHILD_IPC CLOSE_APP_CHILD_DEV_TOOLS");
      }
    } catch (error) {
      log.error(error);
    }
  });

  ipcMain.handle(APP_CHILD_IPC.CLOSE_APP_CHILD_WINDOW, async (_, path: string) => {
    try {
      const childWindows = browserWindow.getChildWindows();

      const child = childWindows.find((window) => {
        const url = new URL(window.webContents.getURL());

        return url.pathname === path;
      });

      if (child?.isClosable()) {
        child.webContents.removeAllListeners("devtools-opened");
        child.webContents.removeAllListeners("devtools-closed");
        child.webContents.removeAllListeners("ipc-message");

        child.close();

        log.info("APP_CHILD_IPC CLOSE_APP_CHILD_WINDOW");
      }
    } catch (error) {
      log.error(error);
    }
  });
};
