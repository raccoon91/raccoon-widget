import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

import { APP_IPC, BLUETOOTH_IPC, STORAGE_IPC, WIDGET_IPC } from "@/constants/ipc";

const appAPI: AppAPI = {
  getAppConfig: () => ipcRenderer.invoke(APP_IPC.GET_APP_CONFIG),
  setAppConfig: (data?: Record<string, number>) => ipcRenderer.invoke(APP_IPC.SET_APP_CONFIG, data),
  minimize: () => ipcRenderer.invoke(APP_IPC.MINIMIZE_WINDOW),
  maximize: () => ipcRenderer.invoke(APP_IPC.MAXIMIZE_WINDOW),
  devtoolsStatusChanged: (callback: (event: IpcRendererEvent, args: boolean) => void) =>
    ipcRenderer.on(APP_IPC.DEVTOOLS_STATUS_CHAGEND, callback),
  openDevTools: () => ipcRenderer.invoke(APP_IPC.OPEN_DEV_TOOLS),
  closeDevTools: () => ipcRenderer.invoke(APP_IPC.CLOSE_DEV_TOOLS),
  close: () => ipcRenderer.invoke(APP_IPC.CLOSE_WINDOW),

  getAppChildConfig: (path: string) => ipcRenderer.invoke(APP_IPC.GET_APP_CHILD_CONFIG, path),
  setAppChildConfig: (path: string, data?: Record<string, number>) =>
    ipcRenderer.invoke(APP_IPC.SET_APP_CHILD_CONFIG, path, data),
  childDevtoolsStatusChanged: (callback: (event: IpcRendererEvent, args: boolean) => void) =>
    ipcRenderer.on(APP_IPC.CHILD_DEVTOOLS_STATUS_CHAGEND, callback),
  openChildDevTools: (path: string) => ipcRenderer.invoke(APP_IPC.OPEN_CHILD_DEV_TOOLS, path),
  closeChildDevTools: (path: string) => ipcRenderer.invoke(APP_IPC.CLOSE_CHILD_DEV_TOOLS, path),
  closeChild: (path: string) => ipcRenderer.invoke(APP_IPC.CLOSE_CHILD_WINDOW, path),
};

const storageAPI: StorageAPI = {
  getStorage: () => ipcRenderer.invoke(STORAGE_IPC.GET_STORAGE),
  setStorage: (data: any) => ipcRenderer.invoke(STORAGE_IPC.SET_STORAGE, data),
  getSession: () => ipcRenderer.invoke(STORAGE_IPC.GET_SESSION),
  setSession: (data: any) => ipcRenderer.invoke(STORAGE_IPC.SET_SESSION, data),
};

const bluetoothAPI: BluetoothAPI = {
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
    contextBridge.exposeInMainWorld("storageAPI", storageAPI);
    contextBridge.exposeInMainWorld("bluetoothAPI", bluetoothAPI);
    contextBridge.exposeInMainWorld("widgetAPI", widgetAPI);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.appAPI = appAPI;
  window.storageAPI = storageAPI;
  window.bluetoothAPI = bluetoothAPI;
  window.widgetAPI = widgetAPI;
}
