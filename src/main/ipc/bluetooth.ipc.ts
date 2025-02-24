import { ipcMain } from "electron";

import { BLUETOOTH_IPC } from "@/constants/ipc";
import shell from "@/main/lib/shell";
import log from "@/main/lib/log";

export const bluetoothIpcHandler = () => {
  ipcMain.handle(BLUETOOTH_IPC.GET_DEVICE_BY_CLASS, async (_, className) => {
    try {
      const result = shell.getDeviceByClass(className);

      log.info("BLUETOOTH_IPC GET_DEVICE_BY_CLASS");

      return result;
    } catch (error) {
      log.error(error);

      return null;
    }
  });

  ipcMain.handle(BLUETOOTH_IPC.GET_DEVICE_PROPERTY_BY_ID, async (_, instanceId) => {
    try {
      const result = shell.getDevicePropertyById(instanceId);

      log.info("BLUETOOTH_IPC GET_DEVICE_PROPERTY_BY_ID");

      return result;
    } catch (error) {
      log.error(error);

      return null;
    }
  });

  ipcMain.handle(BLUETOOTH_IPC.GET_SYSTEM_BY_CONTAINER_ID, async (_, containerId) => {
    try {
      const result = shell.getSystemByContainerId(containerId);

      log.info("BLUETOOTH_IPC GET_SYSTEM_BY_CONTAINER_ID");

      return result;
    } catch (error) {
      log.error(error);

      return null;
    }
  });

  ipcMain.handle(BLUETOOTH_IPC.GET_SYSTEM_PROPERTY_BY_ID, async (_, instanceId) => {
    try {
      const result = shell.getSystemPropertyById(instanceId);

      log.info("BLUETOOTH_IPC GET_SYSTEM_PROPERTY_BY_ID");

      return result;
    } catch (error) {
      log.error(error);

      return null;
    }
  });

  ipcMain.handle(BLUETOOTH_IPC.GET_SYSTEM_PROPERTY_BY_CONTAINER_ID, async (_, containerId) => {
    try {
      const result = shell.getSystemPropertyByContainerId(containerId);

      log.info("BLUETOOTH_IPC GET_SYSTEM_PROPERTY_BY_CONTAINER_ID");

      return result;
    } catch (error) {
      log.error(error);

      return null;
    }
  });
};
