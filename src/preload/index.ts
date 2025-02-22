import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

import { APP_IPC, BLUETOOTH_IPC, WIDGET_IPC } from "@/constants/ipc";

const appAPI: AppAPI = {
  minimize: () => ipcRenderer.invoke(APP_IPC.MINIMIZE_WINDOW),
  maximize: () => ipcRenderer.invoke(APP_IPC.MAXIMIZE_WINDOW),
  close: () => ipcRenderer.invoke(APP_IPC.CLOSE_WINDOW),
};

const systemAPI: SystemAPI = {
  getDeviceByClass: (className) => ipcRenderer.invoke(BLUETOOTH_IPC.GET_DEVICE_BY_CLASS, className),
  getDevicePropertyById: (instanceId) => ipcRenderer.invoke(BLUETOOTH_IPC.GET_DEVICE_PROPERTY_BY_ID, instanceId),
  getSystemByContainerId: (containerId) => ipcRenderer.invoke(BLUETOOTH_IPC.GET_SYSTEM_BY_CONTAINER_ID, containerId),
  getSystemPropertyById: (containerId) => ipcRenderer.invoke(BLUETOOTH_IPC.GET_SYSTEM_PROPERTY_BY_ID, containerId),
  getSystemPropertyByContainerId: (containerId) =>
    ipcRenderer.invoke(BLUETOOTH_IPC.GET_SYSTEM_PROPERTY_BY_CONTAINER_ID, containerId),
};

const widgetAPI: WidgetAPI = {
  preventFromAeroPeek: () => ipcRenderer.invoke(WIDGET_IPC.PREVENT_FROM_AERO_PEEK),
  preventFromShowDesktop: () => ipcRenderer.invoke(WIDGET_IPC.PREVENT_FROM_SHOW_DESKTOP),
  cancelPreventFromShowDesktop: () => ipcRenderer.invoke(WIDGET_IPC.CANCEL_PREVENT_FROM_SHOW_DESKTOP),
  moveToBottom: () => ipcRenderer.invoke(WIDGET_IPC.MOVE_TO_BOTTOM),
  alwaysOnBottom: () => ipcRenderer.invoke(WIDGET_IPC.ALWAYS_TO_BOTTOM),
  cancelAlwaysOnBottom: () => ipcRenderer.invoke(WIDGET_IPC.CANCEL_ALWAYS_TO_BOTTOM),
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("appAPI", appAPI);
    contextBridge.exposeInMainWorld("systemAPI", systemAPI);
    contextBridge.exposeInMainWorld("widgetAPI", widgetAPI);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.appAPI = appAPI;
  window.systemAPI = systemAPI;
  window.widgetAPI = widgetAPI;
}
