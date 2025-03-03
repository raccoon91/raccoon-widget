import { ipcMain } from "electron";

import { WIDGET_IPC } from "@/constants/ipc";
import widget from "@/main/lib/widget";
import log from "@/main/lib/log";

export const widgetIpcHandler = ({ app }: { app: App; parent?: App; children?: App[] }) => {
  ipcMain.handle(WIDGET_IPC.PREVENT_FROM_AERO_PEEK, async () => {
    try {
      widget.preventFromAeroPeek(app.window);

      log.info("[WIDGET_IPC] PREVENT_FROM_AERO_PEEK");
    } catch (error) {
      log.error(error);
    }
  });

  ipcMain.handle(WIDGET_IPC.PREVENT_FROM_SHOW_DESKTOP, async () => {
    try {
      widget.preventFromShowDesktop(app.window);

      log.info("[WIDGET_IPC] PREVENT_FROM_SHOW_DESKTOP");
    } catch (error) {
      log.error(error);
    }
  });

  ipcMain.handle(WIDGET_IPC.CANCEL_PREVENT_FROM_SHOW_DESKTOP, async () => {
    try {
      widget.cancelPreventFromShowDesktop(app.window);

      log.info("[WIDGET_IPC] CANCEL_PREVENT_FROM_SHOW_DESKTOP");
    } catch (error) {
      log.error(error);
    }
  });

  ipcMain.handle(WIDGET_IPC.MOVE_TO_BOTTOM, async () => {
    try {
      widget.moveToBottom(app.window);

      log.info("[WIDGET_IPC] MOVE_TO_BOTTOM");
    } catch (error) {
      log.error(error);
    }
  });

  ipcMain.handle(WIDGET_IPC.ALWAYS_TO_BOTTOM, async () => {
    try {
      widget.alwaysOnBottom(app.window);

      log.info("[WIDGET_IPC] ALWAYS_TO_BOTTOM");
    } catch (error) {
      log.error(error);
    }
  });

  ipcMain.handle(WIDGET_IPC.CANCEL_ALWAYS_TO_BOTTOM, async () => {
    try {
      widget.cancelAlwaysOnBottom(app.window);

      log.info("[WIDGET_IPC] CANCEL_ALWAYS_TO_BOTTOM");
    } catch (error) {
      log.error(error);
    }
  });
};
