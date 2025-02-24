import { exec } from "child_process";
import { ipcMain } from "electron";

import { POWERSHELL } from "@/constants/bluetooth";
import { BLUETOOTH_IPC } from "@/constants/ipc";

export const bluetoothIpcHandler = () => {
  ipcMain.handle(BLUETOOTH_IPC.GET_DEVICE_BY_CLASS, async (_, className) => {
    return new Promise((resolve, reject) => {
      exec(
        `${POWERSHELL.POWERSHELL_COMMAND} "${POWERSHELL.POWERSHELL_TEXT_ENCODING}; Get-PnpDevice -Class '${className}' | ${POWERSHELL.POWERSHELL_CONVERT_TO_JSON}"`,
        (error, stdout, stderr) => {
          if (error) return reject(error);

          if (stderr) return reject(stderr);

          resolve(stdout);
        },
      );
    }).catch((error) => {
      console.error(error);
    });
  });

  ipcMain.handle(BLUETOOTH_IPC.GET_DEVICE_PROPERTY_BY_ID, async (_, instanceId) => {
    return new Promise((resolve, reject) => {
      exec(
        `${POWERSHELL.POWERSHELL_COMMAND} "${POWERSHELL.POWERSHELL_TEXT_ENCODING}; Get-PnpDevice -InstanceId '${instanceId}' | Get-PnpDeviceProperty | ${POWERSHELL.POWERSHELL_CONVERT_TO_JSON}"`,
        (error, stdout, stderr) => {
          if (error) return reject(error);

          if (stderr) return reject(stderr);

          resolve(stdout);
        },
      );
    }).catch((error) => {
      console.error(error);
    });
  });

  ipcMain.handle(BLUETOOTH_IPC.GET_SYSTEM_BY_CONTAINER_ID, async (_, containerId) => {
    return new Promise((resolve, reject) => {
      exec(
        `${POWERSHELL.POWERSHELL_COMMAND} "${POWERSHELL.POWERSHELL_TEXT_ENCODING}; Get-PnpDevice -Class System | Get-PnpDeviceProperty | Where-Object { $_.KeyName -eq 'DEVPKEY_Device_ContainerId' -and $_.Data -eq '${containerId}' } | ${POWERSHELL.POWERSHELL_CONVERT_TO_JSON}`,
        (error, stdout, stderr) => {
          if (error) return reject(error);

          if (stderr) return reject(stderr);

          resolve(stdout);
        },
      );
    }).catch((error) => {
      console.error(error);
    });
  });

  ipcMain.handle(BLUETOOTH_IPC.GET_SYSTEM_PROPERTY_BY_ID, async (_, instanceId) => {
    return new Promise((resolve, reject) => {
      exec(
        `${POWERSHELL.POWERSHELL_COMMAND} "${POWERSHELL.POWERSHELL_TEXT_ENCODING}; Get-PnpDeviceProperty -InstanceId '${instanceId}' | ${POWERSHELL.POWERSHELL_CONVERT_TO_JSON}`,
        (error, stdout, stderr) => {
          if (error) return reject(error);

          if (stderr) return reject(stderr);

          resolve(stdout);
        },
      );
    }).catch((error) => {
      console.error(error);
    });
  });

  ipcMain.handle(BLUETOOTH_IPC.GET_SYSTEM_PROPERTY_BY_CONTAINER_ID, async (_, containerId) => {
    return new Promise((resolve, reject) => {
      exec(
        `${POWERSHELL.POWERSHELL_COMMAND} "${POWERSHELL.POWERSHELL_TEXT_ENCODING}; Get-PnpDeviceProperty -InstanceId (Get-PnpDevice -Class System | Where-Object { (Get-PnpDeviceProperty -InstanceId $_.InstanceId | Where-Object { $_.KeyName -eq 'DEVPKEY_Device_ContainerId' }).Data -eq '${containerId}' }).InstanceId | ${POWERSHELL.POWERSHELL_CONVERT_TO_JSON}`,
        (error, stdout, stderr) => {
          if (error) return reject(error);

          if (stderr) return reject(stderr);

          resolve(stdout);
        },
      );
    }).catch((error) => {
      console.error(error);
    });
  });
};
