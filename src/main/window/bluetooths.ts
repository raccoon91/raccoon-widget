import { join } from "path";
import { BrowserWindow } from "electron";
import { is } from "@electron-toolkit/utils";

import config from "@/main/lib/config";
import widget from "@/main/lib/widget";
import { appIpcHandler } from "@/main/ipc/app.ipc";
import { storageIpcHandler } from "@/main/ipc/storage.ipc";

import icon from "@resources/icon.png?asset";

export const createBluetoothWindow = (name: string): [App, (main: App) => void] => {
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
    // Prevent BrowserWindow from being hidden in AeroPeek.
    widget.preventFromAeroPeek(window);

    // Prevent BrowserWindow from being hidden in ShowDesktop.
    widget.preventFromShowDesktop(window);
  });

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    window.loadURL(`${process.env["ELECTRON_RENDERER_URL"]}/#/${name}`);
  } else {
    window.loadFile(join(__dirname, "../renderer/index.html"), { hash: `/${name}` });
  }

  return [
    app,
    (parent: App) => {
      window.setParentWindow(parent.window);

      appIpcHandler({ app, parent });
      storageIpcHandler({ app, parent });
    },
  ];
};
