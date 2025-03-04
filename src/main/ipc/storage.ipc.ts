import { ipcMain } from "electron";

import { STORAGE_IPC } from "@/constants/ipc";
import storage from "@/main/lib/storage";

export const storageIpcHandler = ({ app, parent, children }: { app: App; parent?: App; children?: App[] }) => {
  ipcMain.handle(`${STORAGE_IPC.GET_STORAGE}:${app.name}`, (_) => {
    return storage.getStorage();
  });

  ipcMain.handle(`${STORAGE_IPC.SET_STORAGE}:${app.name}`, (_, data: any) => {
    storage.setStorage(data);

    if (parent) {
      parent.window.webContents.send(`${STORAGE_IPC.STORAGE_CHANGED}:${parent.name}`);
    }

    children?.forEach((child) => {
      child.window.webContents.send(`${STORAGE_IPC.STORAGE_CHANGED}:${child.name}`);
    });
  });

  ipcMain.handle(`${STORAGE_IPC.GET_SESSION}:${app.name}`, (_) => {
    return storage.getSession();
  });

  ipcMain.handle(`${STORAGE_IPC.SET_SESSION}:${app.name}`, (_, data: any) => {
    storage.setSession(data);

    children?.forEach((child) => {
      child.window.webContents.send(`${STORAGE_IPC.SESSION_CHANGED}:${child.name}`);
    });
  });
};
