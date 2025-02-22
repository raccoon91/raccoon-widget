import { BrowserWindow, ipcMain } from "electron";

import { WIDGET_IPC } from "@/constants/ipc";
import widget from "@/main/lib/widget";

export const widgetIpcHandler = (browserWindow: BrowserWindow) => {
  ipcMain.handle(WIDGET_IPC.PREVENT_FROM_AERO_PEEK, async () => {
    widget.preventFromAeroPeek(browserWindow);
  });

  ipcMain.handle(WIDGET_IPC.PREVENT_FROM_SHOW_DESKTOP, async () => {
    widget.preventFromShowDesktop(browserWindow);
  });

  ipcMain.handle(WIDGET_IPC.CANCEL_PREVENT_FROM_SHOW_DESKTOP, async () => {
    widget.cancelPreventFromShowDesktop(browserWindow);
  });

  ipcMain.handle(WIDGET_IPC.MOVE_TO_BOTTOM, async () => {
    widget.moveToBottom(browserWindow);
  });

  ipcMain.handle(WIDGET_IPC.ALWAYS_TO_BOTTOM, async () => {
    widget.alwaysOnBottom(browserWindow);
  });

  ipcMain.handle(WIDGET_IPC.CANCEL_ALWAYS_TO_BOTTOM, async () => {
    widget.cancelAlwaysOnBottom(browserWindow);
  });
};
