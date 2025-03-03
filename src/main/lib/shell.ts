import { exec } from "child_process";

import { POWERSHELL, PROPERTY_KEY_NAMES } from "@/constants/shell";

class Shell {
  run(script: string) {
    return new Promise<string>((resolve, reject) => {
      exec(
        `${POWERSHELL.POWERSHELL_COMMAND} "${POWERSHELL.POWERSHELL_TEXT_ENCODING}; ${script} | ${POWERSHELL.POWERSHELL_CONVERT_TO_JSON}"`,
        (error, stdout, stderr) => {
          if (error) return reject(error);

          if (stderr) return reject(stderr);

          const result = stdout ? JSON.parse(stdout) : null;

          resolve(result);
        },
      );
    });
  }

  getDeviceByClass(className: string) {
    return new Promise<string>((resolve, reject) => {
      exec(
        `${POWERSHELL.POWERSHELL_COMMAND} "${POWERSHELL.POWERSHELL_TEXT_ENCODING}; Get-PnpDevice -Class '${className}' | Select-Object InstanceId, FriendlyName | ${POWERSHELL.POWERSHELL_CONVERT_TO_JSON}"`,
        (error, stdout, stderr) => {
          if (error) return reject(error);

          if (stderr) return reject(stderr);

          const result = stdout ? JSON.parse(stdout) : null;

          resolve(result);
        },
      );
    });
  }

  getDevicePropertyById(instanceId: string) {
    return new Promise<string>((resolve, reject) => {
      exec(
        `${POWERSHELL.POWERSHELL_COMMAND} "${POWERSHELL.POWERSHELL_TEXT_ENCODING}; Get-PnpDevice -InstanceId '${instanceId}' | Get-PnpDeviceProperty | Where-Object { $_.KeyName -in @(${PROPERTY_KEY_NAMES.join(", ")}) } | Select-Object KeyName, Data | ${POWERSHELL.POWERSHELL_CONVERT_TO_JSON}"`,
        (error, stdout, stderr) => {
          if (error) return reject(error);

          if (stderr) return reject(stderr);

          const result = stdout ? JSON.parse(stdout) : null;

          resolve(result);
        },
      );
    });
  }

  getSystemByContainerId(containerId: string) {
    return new Promise<string>((resolve, reject) => {
      exec(
        `${POWERSHELL.POWERSHELL_COMMAND} "${POWERSHELL.POWERSHELL_TEXT_ENCODING}; Get-PnpDevice -Class System | Get-PnpDeviceProperty | Where-Object { $_.KeyName -eq 'DEVPKEY_Device_ContainerId' -and $_.Data -eq '${containerId}' } | ${POWERSHELL.POWERSHELL_CONVERT_TO_JSON}`,
        (error, stdout, stderr) => {
          if (error) return reject(error);

          if (stderr) return reject(stderr);

          const result = stdout ? JSON.parse(stdout) : null;

          resolve(result);
        },
      );
    });
  }

  getSystemPropertyById(instanceId: string) {
    return new Promise<string>((resolve, reject) => {
      exec(
        `${POWERSHELL.POWERSHELL_COMMAND} "${POWERSHELL.POWERSHELL_TEXT_ENCODING}; Get-PnpDeviceProperty -InstanceId '${instanceId}' | Where-Object { $_.KeyName -in @(${PROPERTY_KEY_NAMES.join(", ")}) } | Select-Object KeyName, Data | ${POWERSHELL.POWERSHELL_CONVERT_TO_JSON}`,
        (error, stdout, stderr) => {
          if (error) return reject(error);

          if (stderr) return reject(stderr);

          const result = stdout ? JSON.parse(stdout) : null;

          resolve(result);
        },
      );
    });
  }

  getSystemPropertyByContainerId(containerId) {
    return new Promise<string>((resolve, reject) => {
      exec(
        `${POWERSHELL.POWERSHELL_COMMAND} "${POWERSHELL.POWERSHELL_TEXT_ENCODING}; Get-PnpDeviceProperty -InstanceId (Get-PnpDevice -Class System | Where-Object { (Get-PnpDeviceProperty -InstanceId $_.InstanceId | Where-Object { $_.KeyName -eq 'DEVPKEY_Device_ContainerId' }).Data -eq '${containerId}' }).InstanceId | Where-Object { $_.KeyName -in @(${PROPERTY_KEY_NAMES.join(", ")}) } | Select-Object KeyName, Data | ${POWERSHELL.POWERSHELL_CONVERT_TO_JSON}`,
        (error, stdout, stderr) => {
          if (error) return reject(error);

          if (stderr) return reject(stderr);

          const result = stdout ? JSON.parse(stdout) : null;

          resolve(result);
        },
      );
    });
  }
}

export default new Shell();
