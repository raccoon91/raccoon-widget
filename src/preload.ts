import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  getDeviceByClass: (param: string) => ipcRenderer.invoke("get-device-by-class", param),
  getDevicePropertyById: (param: string) => ipcRenderer.invoke("get-device-property-by-id", param),
});
