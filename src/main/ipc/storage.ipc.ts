import { BrowserWindow, ipcMain } from "electron";

import { STORAGE_IPC } from "@/constants/ipc";
import storage from "@/main/lib/storage";

export const storageIpcHandler = (browserWindow: BrowserWindow) => {
  ipcMain.handle(STORAGE_IPC.GET_STORAGE, (_) => {
    return storage.getStorage();
  });

  ipcMain.handle(STORAGE_IPC.SET_STORAGE, (_, data: any) => {
    storage.setStorage(data);
  });

  ipcMain.handle(STORAGE_IPC.UPDATE_STORAGE, () => {
    browserWindow.webContents.send(STORAGE_IPC.STORAGE_CHANGED);

    // const children = browserWindow.getChildWindows();

    // children.forEach((child) => {
    //   child.webContents.send(STORAGE_IPC.STORAGE_CHANGED);
    // });
  });

  ipcMain.handle(STORAGE_IPC.GET_SESSION, (_) => {
    return storage.getSession();
  });

  ipcMain.handle(STORAGE_IPC.SET_SESSION, (_, data: any) => {
    storage.setSession(data);
  });

  ipcMain.handle(STORAGE_IPC.UPDATE_SESSION, () => {
    browserWindow.webContents.send(STORAGE_IPC.SESSION_CHANGED);

    // const children = browserWindow.getChildWindows();

    // children.forEach((child) => {
    //   child.webContents.send(STORAGE_IPC.SESSION_CHANGED);
    // });
  });
};
