import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

const api = {
  getDeviceByClass: (className: string) => ipcRenderer.invoke("get-device-by-class", className),
  getDevicePropertyById: (instanceId: string) => ipcRenderer.invoke("get-device-property-by-id", instanceId),
  getSystemByContainerId: (containerId: string) => ipcRenderer.invoke("get-system-by-container-id", containerId),
  getSystemPropertyById: (containerId: string) => ipcRenderer.invoke("get-system-property-by-id", containerId),
  getSystemPropertyByContainerId: (containerId: string) =>
    ipcRenderer.invoke("get-system-property-by-container-id", containerId),
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-expect-error (define in dts)
  window.electron = electronAPI;
  // @ts-expect-error (define in dts)
  window.api = api;
}
