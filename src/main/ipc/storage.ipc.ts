import { ipcMain } from "electron";

import { STORAGE_IPC } from "@/constants/ipc";
import storage from "@/main/lib/storage";

export const storageIpcHandler = () => {
  ipcMain.handle(STORAGE_IPC.GET_STORAGE, (_) => {
    return storage.getStorage();
  });

  ipcMain.handle(STORAGE_IPC.SET_STORAGE, (_, data: any) => {
    storage.setStorage(data);
  });

  ipcMain.handle(STORAGE_IPC.GET_SESSION, (_) => {
    return storage.getSession();
  });

  ipcMain.handle(STORAGE_IPC.SET_SESSION, (_, data: any) => {
    storage.setSession(data);
  });
};
