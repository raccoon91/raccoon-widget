import { join } from "path";
import { BrowserWindow } from "electron";
import { is } from "@electron-toolkit/utils";

import config from "@/main/lib/config";
import widget from "@/main/lib/widget";
import { appIpcHandler } from "@/main/ipc/app.ipc";
import { storageIpcHandler } from "@/main/ipc/storage.ipc";
import { widgetIpcHandler } from "@/main/ipc/widget.ipc";
import { shellIpcHandler } from "@/main/ipc/shell.ipc";

import icon from "@resources/icon.png?asset";

export const createWindow = (name: string): [App, (children?: App[]) => void] => {
  const setting = config.get(name);

  const window = new BrowserWindow({
    show: false,
    icon,
    frame: false,
    transparent: true,
    hasShadow: false,
    fullscreenable: false,
    titleBarStyle: "hidden",
    width: setting.width,
    height: setting.height,
    x: setting.x,
    y: setting.y,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  const app = { name, window };

  window.setMenu(null);

  window.on("ready-to-show", () => {
    window.show();

    // Prevent BrowserWindow from being hidden in AeroPeek.
    widget.preventFromAeroPeek(window);

    // Prevent BrowserWindow from being hidden in ShowDesktop.
    widget.preventFromShowDesktop(window);

    // Move BrowserWindow to the bottom of the windows
    widget.moveToBottom(window);
  });

  // window.webContents.setWindowOpenHandler(({ url }) => {
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
  //       parent: window,
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
    window.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    window.loadFile(join(__dirname, "../renderer/index.html"));
  }

  return [
    app,
    (children?: App[]) => {
      appIpcHandler({ app });
      storageIpcHandler({ app, children });
      widgetIpcHandler({ app });
      shellIpcHandler();
    },
  ];
};
