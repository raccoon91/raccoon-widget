import { ipcMain } from "electron";

import { STORAGE_IPC } from "@/constants/ipc";
import storage from "@/main/lib/storage";

export const storageIpcHandler = ({ app, parent, children }: { app: App; parent?: App; children?: App[] }) => {
  ipcMain.handle(`${STORAGE_IPC.GET_STORAGE}:${app.name}`, (_) => {
    return storage.getStorage();
  });

  ipcMain.handle(`${STORAGE_IPC.SET_STORAGE}:${app.name}`, (_, data: any) => {
    console.log("set storage ipc");
    storage.setStorage(data);
  });

  ipcMain.handle(`${STORAGE_IPC.UPDATE_STORAGE}:${app.name}`, () => {
    if (parent) parent.window.webContents.send(`${STORAGE_IPC.STORAGE_CHANGED}:${parent.name}`);

    children?.forEach((child) => {
      child.window.webContents.send(`${STORAGE_IPC.STORAGE_CHANGED}:${child.name}`);
    });
  });

  ipcMain.handle(`${STORAGE_IPC.GET_SESSION}:${app.name}`, (_) => {
    return storage.getSession();
  });

  ipcMain.handle(`${STORAGE_IPC.SET_SESSION}:${app.name}`, (_, data: any) => {
    console.log("set session ipc");
    storage.setSession(data);
  });

  ipcMain.handle(`${STORAGE_IPC.UPDATE_SESSION}:${app.name}`, () => {
    if (parent) parent.window.webContents.send(`${STORAGE_IPC.SESSION_CHANGED}:${parent.name}`);

    children?.forEach((child) => {
      child.window.webContents.send(`${STORAGE_IPC.SESSION_CHANGED}:${child.name}`);
    });
  });
};
