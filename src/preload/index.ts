import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

const api: PreloadAPI = {
  getDeviceByClass: (className) => ipcRenderer.invoke("get-device-by-class", className),
  getDevicePropertyById: (instanceId) => ipcRenderer.invoke("get-device-property-by-id", instanceId),
  getSystemByContainerId: (containerId) => ipcRenderer.invoke("get-system-by-container-id", containerId),
  getSystemPropertyById: (containerId) => ipcRenderer.invoke("get-system-property-by-id", containerId),
  getSystemPropertyByContainerId: (containerId) =>
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
  window.electron = electronAPI;
  window.api = api;
}
