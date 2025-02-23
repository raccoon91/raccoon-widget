import { exec } from "child_process";

const POWERSHELL_COMMAND = "powershell -Command";
const POWERSHELL_TEXT_ENCODING = "[System.Console]::OutputEncoding = [System.Text.Encoding]::UTF8";
const POWERSHELL_CONVERT_TO_JSON = "ConvertTo-Json";
const POWERSHELL_PROPERTIES =
  "DEVPKEY_NAME, DEVPKEY_Device_Class, DEVPKEY_Device_DeviceDesc, DEVPKEY_Device_Manufacturer, DEVPKEY_Device_FriendlyName, DEVPKEY_Device_InstanceId, DEVPKEY_Device_ContainerId, '{104EA319-6EE2-4701-BD47-8DDBF425BBE5} 2', '{83DA6326-97A6-4088-9453-A1923F573B29} 15'";

// "Select-Object InstanceId, FriendlyName"
// `${POWERSHELL_COMMAND} "${POWERSHELL_TEXT_ENCODING}; Get-PnpDevice -Class '${className}' | ${POWERSHELL_CONVERT_TO_JSON}"`

// const className = "Bluetooth";
const instanceId = "BTHENUM\\DEV_DCCCE61F7DB1\\7&3B1D614A&0&BLUETOOTHDEVICE_DCCCE61F7DB1";

(() => {
  console.time("shell");

  exec(
    `${POWERSHELL_COMMAND} "${POWERSHELL_TEXT_ENCODING}; Get-PnpDevice -InstanceId '${instanceId}' | Get-PnpDeviceProperty | Select-Object ${POWERSHELL_PROPERTIES} | ${POWERSHELL_CONVERT_TO_JSON}"`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(error);
        return;
      }

      if (stderr) {
        console.error(stderr);
        return;
      }

      console.timeLog("shell");

      const result = JSON.parse(stdout);

      // console.log(stdout.length, result.length);
      console.log(result);

      console.timeEnd("shell");
    },
  );
})();
