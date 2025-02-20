import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  getDeviceByClass: (className: string) => ipcRenderer.invoke("get-device-by-class", className),
  getDevicePropertyById: (instanceId: string) => ipcRenderer.invoke("get-device-property-by-id", instanceId),
  getSystemByContainerId: (containerId: string) => ipcRenderer.invoke("get-system-by-container-id", containerId),
  getSystemPropertyById: (containerId: string) => ipcRenderer.invoke("get-system-property-by-id", containerId),
  getSystemPropertyByContainerId: (containerId: string) =>
    ipcRenderer.invoke("get-system-property-by-container-id", containerId),
});
