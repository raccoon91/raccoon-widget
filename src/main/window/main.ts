import { join } from "path";
import { BrowserWindow } from "electron";
import { is } from "@electron-toolkit/utils";

import { APP } from "@/constants/app";
import { APP_NAME } from "@/constants/app-name";
import { APP_IPC } from "@/constants/ipc";
import config from "@/main/lib/config";
import widget from "@/main/lib/widget";
import { appIpcHandler } from "@/main/ipc/app.ipc";
import { storageIpcHandler } from "@/main/ipc/storage.ipc";
import { widgetIpcHandler } from "@/main/ipc/widget.ipc";
import { shellIpcHandler } from "@/main/ipc/shell.ipc";

import icon from "@resources/icon.png?asset";

export const createWindow = (): [App, (children?: App[]) => void] => {
  const setting = config.get(APP_NAME.MAIN);

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

  // mainWindow.webContents.setWindowOpenHandler(({ url }) => {
  //   if (!url) return { action: "deny" };
  //   const path = new URL(url).pathname;
  //   const setting = config.getChild(path);
  //   return {
  //     action: "allow",
  //     overrideBrowserWindowOptions: {
  //       icon,
  //       frame: false,
  //       transparent: true,
  //       hasShadow: false,
  //       fullscreenable: false,
  //       titleBarStyle: "hidden",
  //       parent: mainWindow,
  //       width: setting.width,
  //       height: setting.height,
  //       x: setting.x,
  //       y: setting.y,
  //       webPreferences: {
  //         preload: join(__dirname, "../preload/index.js"),
  //         sandbox: false,
  //       },
  //     },
  //   };
  // });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  const mainApp = { name: APP_NAME.MAIN, window: mainWindow };

  return [
    mainApp,
    (children?: App[]) => {
      appIpcHandler({ app: mainApp });
      storageIpcHandler({ app: mainApp, children });
      widgetIpcHandler({ app: mainApp });
      shellIpcHandler();

      mainWindow.webContents.on("devtools-opened", () => {
        mainWindow.webContents.send(APP_IPC.DEVTOOLS_STATUS_CHAGEND, true);
      });

      mainWindow.webContents.on("devtools-closed", () => {
        mainWindow.webContents.send(APP_IPC.DEVTOOLS_STATUS_CHAGEND, false);
      });
    },
  ];
};
