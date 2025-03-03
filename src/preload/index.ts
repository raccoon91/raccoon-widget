import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

import { APP_IPC, SHELL_IPC, STORAGE_IPC, WIDGET_IPC } from "@/constants/ipc";
import { APP_NAME } from "@/constants/app-name";

const mainAppAPI: AppAPI & MainAppAPI = {
  getConfig: () => ipcRenderer.invoke(`${APP_IPC.GET_APP_CONFIG}:${APP_NAME.MAIN}`),
  setConfig: (data?: Record<string, number>) => ipcRenderer.invoke(`${APP_IPC.SET_APP_CONFIG}:${APP_NAME.MAIN}`, data),
  minimize: () => ipcRenderer.invoke(`${APP_IPC.MINIMIZE_WINDOW}:${APP_NAME.MAIN}`),
  maximize: () => ipcRenderer.invoke(`${APP_IPC.MAXIMIZE_WINDOW}:${APP_NAME.MAIN}`),
  devtoolsStatusChanged: (callback: (event: IpcRendererEvent, args: boolean) => void) =>
    ipcRenderer.on(`${APP_IPC.DEVTOOLS_STATUS_CHAGEND}:${APP_NAME.MAIN}`, callback),
  removeDevtoolsStatusChanged: () =>
    ipcRenderer.removeAllListeners(`${APP_IPC.DEVTOOLS_STATUS_CHAGEND}:${APP_NAME.MAIN}`),
  openDevTools: () => ipcRenderer.invoke(`${APP_IPC.OPEN_DEV_TOOLS}:${APP_NAME.MAIN}`),
  closeDevTools: () => ipcRenderer.invoke(`${APP_IPC.CLOSE_DEV_TOOLS}:${APP_NAME.MAIN}`),
  close: () => ipcRenderer.invoke(`${APP_IPC.CLOSE_WINDOW}:${APP_NAME.MAIN}`),

  openBluetoothApp: () => ipcRenderer.invoke(`${APP_IPC.OPEN_WINDOW}:${APP_NAME.BLUETOOTH}`),
  closeBluetoothApp: () => ipcRenderer.invoke(`${APP_IPC.CLOSE_WINDOW}:${APP_NAME.BLUETOOTH}`),
};

const bluetoothAppAPI: AppAPI = {
  getConfig: () => ipcRenderer.invoke(`${APP_IPC.GET_APP_CONFIG}:${APP_NAME.BLUETOOTH}`),
  setConfig: (data?: Record<string, number>) =>
    ipcRenderer.invoke(`${APP_IPC.SET_APP_CONFIG}:${APP_NAME.BLUETOOTH}`, data),
  minimize: () => ipcRenderer.invoke(`${APP_IPC.MINIMIZE_WINDOW}:${APP_NAME.BLUETOOTH}`),
  maximize: () => ipcRenderer.invoke(`${APP_IPC.MAXIMIZE_WINDOW}:${APP_NAME.BLUETOOTH}`),
  devtoolsStatusChanged: (callback: (event: IpcRendererEvent, args: boolean) => void) =>
    ipcRenderer.on(`${APP_IPC.DEVTOOLS_STATUS_CHAGEND}:${APP_NAME.BLUETOOTH}`, callback),
  removeDevtoolsStatusChanged: () =>
    ipcRenderer.removeAllListeners(`${APP_IPC.DEVTOOLS_STATUS_CHAGEND}:${APP_NAME.BLUETOOTH}`),
  openDevTools: () => ipcRenderer.invoke(`${APP_IPC.OPEN_DEV_TOOLS}:${APP_NAME.BLUETOOTH}`),
  closeDevTools: () => ipcRenderer.invoke(`${APP_IPC.CLOSE_DEV_TOOLS}:${APP_NAME.BLUETOOTH}`),
  close: () => ipcRenderer.invoke(`${APP_IPC.CLOSE_WINDOW}:${APP_NAME.BLUETOOTH}`),
};

const mainStorageAPI: StorageAPI = {
  getStorage: () => ipcRenderer.invoke(`${STORAGE_IPC.GET_STORAGE}:${APP_NAME.MAIN}`),
  setStorage: (data: any) => ipcRenderer.invoke(`${STORAGE_IPC.SET_STORAGE}:${APP_NAME.MAIN}`, data),
  updateStorage: () => ipcRenderer.invoke(`${STORAGE_IPC.UPDATE_STORAGE}:${APP_NAME.MAIN}`),
  storageChanged: (callback: (event: IpcRendererEvent, args: boolean) => void) =>
    ipcRenderer.on(`${STORAGE_IPC.STORAGE_CHANGED}:${APP_NAME.MAIN}`, callback),
  removeStorageChanged: () => ipcRenderer.removeAllListeners(`${STORAGE_IPC.STORAGE_CHANGED}:${APP_NAME.MAIN}`),

  getSession: () => ipcRenderer.invoke(`${STORAGE_IPC.GET_SESSION}:${APP_NAME.MAIN}`),
  setSession: (data: any) => ipcRenderer.invoke(`${STORAGE_IPC.SET_SESSION}:${APP_NAME.MAIN}`, data),
  updateSession: () => ipcRenderer.invoke(`${STORAGE_IPC.UPDATE_SESSION}:${APP_NAME.MAIN}`),
  sessionChanged: (callback: (event: IpcRendererEvent, args: boolean) => void) =>
    ipcRenderer.on(`${STORAGE_IPC.SESSION_CHANGED}:${APP_NAME.MAIN}`, callback),
  removeSessionChanged: () => ipcRenderer.removeAllListeners(`${STORAGE_IPC.SESSION_CHANGED}:${APP_NAME.MAIN}`),
};

const bluetoothStorageAPI: StorageAPI = {
  getStorage: () => ipcRenderer.invoke(`${STORAGE_IPC.GET_STORAGE}:${APP_NAME.BLUETOOTH}`),
  setStorage: (data: any) => ipcRenderer.invoke(`${STORAGE_IPC.SET_STORAGE}:${APP_NAME.BLUETOOTH}`, data),
  updateStorage: () => ipcRenderer.invoke(`${STORAGE_IPC.UPDATE_STORAGE}:${APP_NAME.BLUETOOTH}`),
  storageChanged: (callback: (event: IpcRendererEvent, args: boolean) => void) =>
    ipcRenderer.on(`${STORAGE_IPC.STORAGE_CHANGED}:${APP_NAME.BLUETOOTH}`, callback),
  removeStorageChanged: () => ipcRenderer.removeAllListeners(`${STORAGE_IPC.STORAGE_CHANGED}:${APP_NAME.BLUETOOTH}`),

  getSession: () => ipcRenderer.invoke(`${STORAGE_IPC.GET_SESSION}:${APP_NAME.BLUETOOTH}`),
  setSession: (data: any) => ipcRenderer.invoke(`${STORAGE_IPC.SET_SESSION}:${APP_NAME.BLUETOOTH}`, data),
  updateSession: () => ipcRenderer.invoke(`${STORAGE_IPC.UPDATE_SESSION}:${APP_NAME.BLUETOOTH}`),
  sessionChanged: (callback: (event: IpcRendererEvent, args: boolean) => void) =>
    ipcRenderer.on(`${STORAGE_IPC.SESSION_CHANGED}:${APP_NAME.BLUETOOTH}`, callback),
  removeSessionChanged: () => ipcRenderer.removeAllListeners(`${STORAGE_IPC.SESSION_CHANGED}:${APP_NAME.BLUETOOTH}`),
};

const shellAPI: ShellAPI = {
  getDeviceByClass: (className) => ipcRenderer.invoke(SHELL_IPC.GET_DEVICE_BY_CLASS, className),
  getDevicePropertyById: (instanceId) => ipcRenderer.invoke(SHELL_IPC.GET_DEVICE_PROPERTY_BY_ID, instanceId),
  getSystemByContainerId: (containerId) => ipcRenderer.invoke(SHELL_IPC.GET_SYSTEM_BY_CONTAINER_ID, containerId),
  getSystemPropertyById: (containerId) => ipcRenderer.invoke(SHELL_IPC.GET_SYSTEM_PROPERTY_BY_ID, containerId),
  getSystemPropertyByContainerId: (containerId) =>
    ipcRenderer.invoke(SHELL_IPC.GET_SYSTEM_PROPERTY_BY_CONTAINER_ID, containerId),
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
    contextBridge.exposeInMainWorld("mainAppAPI", mainAppAPI);
    contextBridge.exposeInMainWorld("bluetoothAppAPI", bluetoothAppAPI);
    contextBridge.exposeInMainWorld("mainStorageAPI", mainStorageAPI);
    contextBridge.exposeInMainWorld("bluetoothStorageAPI", bluetoothStorageAPI);
    contextBridge.exposeInMainWorld("shellAPI", shellAPI);
    contextBridge.exposeInMainWorld("widgetAPI", widgetAPI);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.mainAppAPI = mainAppAPI;
  window.bluetoothAppAPI = bluetoothAppAPI;
  window.mainStorageAPI = mainStorageAPI;
  window.bluetoothStorageAPI = bluetoothStorageAPI;
  window.shellAPI = shellAPI;
  window.widgetAPI = widgetAPI;
}
