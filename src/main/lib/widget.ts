import { BrowserWindow } from "electron";

import { WM_WINDOWPOSCHANGING } from "../constants/windows";
import { Win } from "../helper/utils";
import {
  getDesktopWindow,
  getSHELLDLL_DefViewHandle,
  preventFromAeroPeek,
  setOwnerWindow,
  zOrderToBottom,
} from "../helper/ffi";

class WidgetModule {
  preventFromAeroPeek(win: Win) {
    return preventFromAeroPeek(win);
  }

  preventFromShowDesktop(win: Win) {
    return setOwnerWindow(win, getSHELLDLL_DefViewHandle());
  }

  cancelPreventFromShowDesktop(win: Win) {
    return setOwnerWindow(win, getDesktopWindow());
  }

  moveToBottom(win: Win) {
    return zOrderToBottom(win);
  }

  alwaysOnBottom(browserWindow: BrowserWindow) {
    const winBuffer = browserWindow.getNativeWindowHandle();

    this.moveToBottom(winBuffer);
    this.preventFromShowDesktop(winBuffer);
  }

  cancelAlwaysOnBottom(browserWindow: BrowserWindow) {
    const winBuffer = browserWindow.getNativeWindowHandle();

    browserWindow.unhookWindowMessage(WM_WINDOWPOSCHANGING);

    this.cancelPreventFromShowDesktop(winBuffer);
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

  preventFromAeroPeek(win: Win) {
    return this.module?.preventFromAeroPeek(win);
  }

  preventFromShowDesktop(win: Win) {
    return this.module?.preventFromShowDesktop(win);
  }

  cancelPreventFromShowDesktop(win: Win) {
    return this.module?.cancelPreventFromShowDesktop(win);
  }

  moveToBottom(win: Win) {
    return this.module?.moveToBottom(win);
  }

  alwaysOnBottom(browserWindow: BrowserWindow) {
    return this.module?.alwaysOnBottom(browserWindow);
  }

  cancelAlwaysOnBottom(browserWindow: BrowserWindow) {
    return this.module?.cancelAlwaysOnBottom(browserWindow);
  }
}

export default new Widget();
