import { ipcMain } from "electron";

import { APP_IPC } from "@/constants/ipc";
import config from "@/main/lib/config";
import log from "@/main/lib/log";
import { APP_NAME } from "@/constants/app-name";

export const appIpcHandler = ({ app }: { app: App; parent?: App; children?: App[] }) => {
  ipcMain.handle(`${APP_IPC.GET_APP_CONFIG}:${app.name}`, () => {
    try {
      const result = config.get(app.name);

      log.info(`[APP_IPC] GET_APP_CONFIG:${app.name}`);

      return result;
    } catch (error) {
      log.error(error);

      return null;
    }
  });

  ipcMain.handle(`${APP_IPC.SET_APP_CONFIG}:${app.name}`, (_, data?: Record<string, number>) => {
    try {
      config.set(app.name, data);

      log.info(`[APP_IPC] SET_APP_CONFIG:${app.name}`);
    } catch (error) {
      log.error(error);
    }
  });

  ipcMain.handle(`${APP_IPC.MINIMIZE_WINDOW}:${app.name}`, async () => {
    try {
      if (app.window.isMinimizable()) {
        app.window.minimize();

        log.info(`[APP_IPC] MINIMIZE_WINDOW:${app.name}`);
      }
    } catch (error) {
      log.error(error);
    }
  });

  ipcMain.handle(`${APP_IPC.MAXIMIZE_WINDOW}:${app.name}`, async () => {
    try {
      if (app.window.isMaximizable()) {
        app.window.maximize();

        log.info(`[APP_IPC] MAXIMIZE_WINDOW:${app.name}`);
      }
    } catch (error) {
      log.error(error);
    }
  });

  ipcMain.handle(`${APP_IPC.OPEN_DEV_TOOLS}:${app.name}`, async () => {
    try {
      if (!app.window.webContents.isDevToolsOpened()) {
        app.window.webContents.openDevTools({ mode: "detach" });

        log.info(`[APP_IPC] OPEN_DEV_TOOLS:${app.name}`);
      }
    } catch (error) {
      log.error(error);
    }
  });

  ipcMain.handle(`${APP_IPC.CLOSE_DEV_TOOLS}:${app.name}`, async () => {
    try {
      if (app.window.webContents.isDevToolsOpened()) {
        app.window.webContents.closeDevTools();

        log.info(`[APP_IPC] CLOSE_DEV_TOOLS:${app.name}`);
      }
    } catch (error) {
      log.error(error);
    }
  });

  app.window.webContents.on("devtools-opened", () => {
    app.window.webContents.send(`${APP_IPC.DEVTOOLS_STATUS_CHAGEND}:${app.name}`, true);
  });

  app.window.webContents.on("devtools-closed", () => {
    app.window.webContents.send(`${APP_IPC.DEVTOOLS_STATUS_CHAGEND}:${app.name}`, false);
  });

  if (app.name === APP_NAME.MAIN) {
    ipcMain.handle(`${APP_IPC.CLOSE_WINDOW}:${app.name}`, async () => {
      try {
        if (app.window.isClosable()) {
          app.window.close();

          log.info(`[APP_IPC] CLOSE_WINDOW:${app.name}`);
        }
      } catch (error) {
        log.error(error);
      }
    });
  } else {
    ipcMain.handle(`${APP_IPC.OPEN_WINDOW}:${app.name}`, () => {
      app.window.show();

      log.info(`[APP_IPC] OPEN_WINDOW:${app.name}`);
    });

    ipcMain.handle(`${APP_IPC.CLOSE_WINDOW}:${app.name}`, () => {
      app.window.hide();

      log.info(`[APP_IPC] CLOSE_WINDOW:${app.name}`);
    });
  }
};
