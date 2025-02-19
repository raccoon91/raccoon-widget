import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  getPairedBluetooth: () => ipcRenderer.invoke("get-paired-bluetooth"),
});
