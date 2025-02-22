import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

import { BLUETOOTH_IPC } from "@/constants/ipc";

const api: PreloadAPI = {
  getDeviceByClass: (className) => ipcRenderer.invoke(BLUETOOTH_IPC.GET_DEVICE_BY_CLASS, className),
  getDevicePropertyById: (instanceId) => ipcRenderer.invoke(BLUETOOTH_IPC.GET_DEVICE_PROPERTY_BY_ID, instanceId),
  getSystemByContainerId: (containerId) => ipcRenderer.invoke(BLUETOOTH_IPC.GET_SYSTEM_BY_CONTAINER_ID, containerId),
  getSystemPropertyById: (containerId) => ipcRenderer.invoke(BLUETOOTH_IPC.GET_SYSTEM_PROPERTY_BY_ID, containerId),
  getSystemPropertyByContainerId: (containerId) =>
    ipcRenderer.invoke(BLUETOOTH_IPC.GET_SYSTEM_PROPERTY_BY_CONTAINER_ID, containerId),
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
