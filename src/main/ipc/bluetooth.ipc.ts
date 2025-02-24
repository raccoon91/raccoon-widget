import { ipcMain } from "electron";

import { BLUETOOTH_IPC } from "@/constants/ipc";
import shell from "@/main/lib/shell";

export const bluetoothIpcHandler = () => {
  ipcMain.handle(BLUETOOTH_IPC.GET_DEVICE_BY_CLASS, async (_, className) => {
    return shell.getDeviceByClass(className);
  });

  ipcMain.handle(BLUETOOTH_IPC.GET_DEVICE_PROPERTY_BY_ID, async (_, instanceId) => {
    return shell.getDevicePropertyById(instanceId);
  });

  ipcMain.handle(BLUETOOTH_IPC.GET_SYSTEM_BY_CONTAINER_ID, async (_, containerId) => {
    return shell.getSystemByContainerId(containerId);
  });

  ipcMain.handle(BLUETOOTH_IPC.GET_SYSTEM_PROPERTY_BY_ID, async (_, instanceId) => {
    return shell.getSystemPropertyById(instanceId);
  });

  ipcMain.handle(BLUETOOTH_IPC.GET_SYSTEM_PROPERTY_BY_CONTAINER_ID, async (_, containerId) => {
    return shell.getSystemPropertyByContainerId(containerId);
  });
};
