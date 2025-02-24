import { exec } from "child_process";

import { POWERSHELL } from "@/constants/bluetooth";

class Shell {
  getDeviceByClass(className: string) {
    return new Promise((resolve, reject) => {
      exec(
        `${POWERSHELL.POWERSHELL_COMMAND} "${POWERSHELL.POWERSHELL_TEXT_ENCODING}; Get-PnpDevice -Class '${className}' | ${POWERSHELL.POWERSHELL_CONVERT_TO_JSON}"`,
        (error, stdout, stderr) => {
          if (error) return reject(error);

          if (stderr) return reject(stderr);

          resolve(stdout);
        },
      );
    });
  }

  getDevicePropertyById(instanceId: string) {
    return new Promise((resolve, reject) => {
      exec(
        `${POWERSHELL.POWERSHELL_COMMAND} "${POWERSHELL.POWERSHELL_TEXT_ENCODING}; Get-PnpDevice -InstanceId '${instanceId}' | Get-PnpDeviceProperty | ${POWERSHELL.POWERSHELL_CONVERT_TO_JSON}"`,
        (error, stdout, stderr) => {
          if (error) return reject(error);

          if (stderr) return reject(stderr);

          resolve(stdout);
        },
      );
    });
  }

  getSystemByContainerId(containerId: string) {
    return new Promise((resolve, reject) => {
      exec(
        `${POWERSHELL.POWERSHELL_COMMAND} "${POWERSHELL.POWERSHELL_TEXT_ENCODING}; Get-PnpDevice -Class System | Get-PnpDeviceProperty | Where-Object { $_.KeyName -eq 'DEVPKEY_Device_ContainerId' -and $_.Data -eq '${containerId}' } | ${POWERSHELL.POWERSHELL_CONVERT_TO_JSON}`,
        (error, stdout, stderr) => {
          if (error) return reject(error);

          if (stderr) return reject(stderr);

          resolve(stdout);
        },
      );
    });
  }

  getSystemPropertyById(instanceId: string) {
    return new Promise((resolve, reject) => {
      exec(
        `${POWERSHELL.POWERSHELL_COMMAND} "${POWERSHELL.POWERSHELL_TEXT_ENCODING}; Get-PnpDeviceProperty -InstanceId '${instanceId}' | ${POWERSHELL.POWERSHELL_CONVERT_TO_JSON}`,
        (error, stdout, stderr) => {
          if (error) return reject(error);

          if (stderr) return reject(stderr);

          resolve(stdout);
        },
      );
    });
  }

  getSystemPropertyByContainerId(containerId) {
    return new Promise((resolve, reject) => {
      exec(
        `${POWERSHELL.POWERSHELL_COMMAND} "${POWERSHELL.POWERSHELL_TEXT_ENCODING}; Get-PnpDeviceProperty -InstanceId (Get-PnpDevice -Class System | Where-Object { (Get-PnpDeviceProperty -InstanceId $_.InstanceId | Where-Object { $_.KeyName -eq 'DEVPKEY_Device_ContainerId' }).Data -eq '${containerId}' }).InstanceId | ${POWERSHELL.POWERSHELL_CONVERT_TO_JSON}`,
        (error, stdout, stderr) => {
          if (error) return reject(error);

          if (stderr) return reject(stderr);

          resolve(stdout);
        },
      );
    });
  }
}

export default new Shell();
