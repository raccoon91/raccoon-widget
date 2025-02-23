import { BrowserWindow } from "electron";

import { WM_WINDOWPOSCHANGING } from "@/constants/windows";
import {
  getDesktopWindow,
  getSHELLDLL_DefViewHandle,
  preventFromAeroPeek,
  setOwnerWindow,
  zOrderToBottom,
} from "@/main/helper/ffi";

class WidgetModule {
  preventFromAeroPeek(browserWindow: BrowserWindow) {
    return preventFromAeroPeek(browserWindow);
  }

  preventFromShowDesktop(browserWindow: BrowserWindow) {
    return setOwnerWindow(browserWindow, getSHELLDLL_DefViewHandle());
  }

  cancelPreventFromShowDesktop(browserWindow: BrowserWindow) {
    return setOwnerWindow(browserWindow, getDesktopWindow());
  }

  moveToBottom(browserWindow: BrowserWindow) {
    return zOrderToBottom(browserWindow);
  }

  alwaysOnBottom(browserWindow: BrowserWindow) {
    browserWindow.setResizable(false);

    this.moveToBottom(browserWindow);
    this.preventFromShowDesktop(browserWindow);
  }

  cancelAlwaysOnBottom(browserWindow: BrowserWindow) {
    browserWindow.moveTop();
    browserWindow.setResizable(true);
    browserWindow.unhookWindowMessage(WM_WINDOWPOSCHANGING);

    this.cancelPreventFromShowDesktop(browserWindow);
  }
}

class Widget {
  platform: NodeJS.Platform;
  module: WidgetModule;

  constructor() {
    this.platform = process.platform;

    switch (this.platform) {
      case "win32":
        this.module = new WidgetModule();

        break;
      default:
        throw new Error(`This module is not currently supported by OS: ${this.platform}`);
    }
  }

  preventFromAeroPeek(browserWindow: BrowserWindow) {
    return this.module?.preventFromAeroPeek(browserWindow);
  }

  preventFromShowDesktop(browserWindow: BrowserWindow) {
    return this.module?.preventFromShowDesktop(browserWindow);
  }

  cancelPreventFromShowDesktop(browserWindow: BrowserWindow) {
    return this.module?.cancelPreventFromShowDesktop(browserWindow);
  }

  moveToBottom(browserWindow: BrowserWindow) {
    return this.module?.moveToBottom(browserWindow);
  }

  alwaysOnBottom(browserWindow: BrowserWindow) {
    return this.module?.alwaysOnBottom(browserWindow);
  }

  cancelAlwaysOnBottom(browserWindow: BrowserWindow) {
    return this.module?.cancelAlwaysOnBottom(browserWindow);
  }
}

export default new Widget();
