import { join } from "path";
import { BrowserWindow } from "electron";
import { is } from "@electron-toolkit/utils";

import { APP_NAME } from "@/constants/app-name";
import { APP_IPC } from "@/constants/ipc";
import config from "@/main/lib/config";
import widget from "@/main/lib/widget";
import { appIpcHandler } from "@/main/ipc/app.ipc";
import { storageIpcHandler } from "@/main/ipc/storage.ipc";

import icon from "@resources/icon.png?asset";

export const createBluetoothWindow = (name: string): [App, (main: App) => void] => {
  const setting = config.get(APP_NAME.BLUETOOTH);

  const bluetoothWindow = new BrowserWindow({
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

  bluetoothWindow.setMenu(null);

  bluetoothWindow.on("ready-to-show", () => {
    // Prevent BrowserWindow from being hidden in AeroPeek.
    widget.preventFromAeroPeek(bluetoothWindow);

    // Prevent BrowserWindow from being hidden in ShowDesktop.
    widget.preventFromShowDesktop(bluetoothWindow);
  });

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    bluetoothWindow.loadURL(`${process.env["ELECTRON_RENDERER_URL"]}/bluetooth`);
  } else {
    bluetoothWindow.loadFile(join(__dirname, "../renderer/index.html#bluetooth"));
  }

  const bluetoothApp = { name, window: bluetoothWindow };

  return [
    bluetoothApp,
    (main: App) => {
      bluetoothWindow.setParentWindow(main.window);

      appIpcHandler({ app: bluetoothApp, parent: main });
      storageIpcHandler({ app: bluetoothApp, parent: main });

      bluetoothWindow.webContents.on("devtools-opened", () => {
        bluetoothWindow.webContents.send(APP_IPC.DEVTOOLS_STATUS_CHAGEND, true);
      });

      bluetoothWindow.webContents.on("devtools-closed", () => {
        bluetoothWindow.webContents.send(APP_IPC.DEVTOOLS_STATUS_CHAGEND, false);
      });
    },
  ];
};
