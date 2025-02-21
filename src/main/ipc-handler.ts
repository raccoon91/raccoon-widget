import { exec } from "child_process";
import { ipcMain } from "electron";

export const ipcHandler = () => {
  ipcMain.handle("get-device-by-class", async (_, className) => {
    return new Promise((resolve, reject) => {
      exec(
        `powershell -Command "[System.Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Get-PnpDevice -Class '${className}' | ConvertTo-Json"`,
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

  ipcMain.handle("get-device-property-by-id", async (_, instanceId) => {
    return new Promise((resolve, reject) => {
      exec(
        `powershell -Command "[System.Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Get-PnpDevice -InstanceId '${instanceId}' | Get-PnpDeviceProperty | ConvertTo-Json"`,
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

  ipcMain.handle("get-system-by-container-id", async (_, containerId) => {
    return new Promise((resolve, reject) => {
      exec(
        `powershell -Command "Get-PnpDevice -Class System | Get-PnpDeviceProperty | Where-Object { $_.KeyName -eq 'DEVPKEY_Device_ContainerId' -and $_.Data -eq '${containerId}' } | ConvertTo-Json`,
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

  ipcMain.handle("get-system-property-by-id", async (_, instanceId) => {
    return new Promise((resolve, reject) => {
      exec(
        `powershell -Command "Get-PnpDeviceProperty -InstanceId '${instanceId}' | ConvertTo-Json`,
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

  ipcMain.handle("get-system-property-by-container-id", async (_, containerId) => {
    return new Promise((resolve, reject) => {
      exec(
        `powershell -Command "Get-PnpDeviceProperty -InstanceId (Get-PnpDevice -Class System | Where-Object { (Get-PnpDeviceProperty -InstanceId $_.InstanceId | Where-Object { $_.KeyName -eq 'DEVPKEY_Device_ContainerId' }).Data -eq '${containerId}' }).InstanceId | ConvertTo-Json`,
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
