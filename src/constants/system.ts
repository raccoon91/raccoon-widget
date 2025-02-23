export const POWERSHELL_COMMAND = "powershell -Command";

export const POWERSHELL_TEXT_ENCODING = "[System.Console]::OutputEncoding = [System.Text.Encoding]::UTF8";

export const POWERSHELL_CONVERT_TO_JSON = "ConvertTo-Json";

export const PROPERTY_MAP: Record<string, Record<string, string>> = {
  DEVPKEY_NAME: {
    name: "name",
    value: "name",
    keyName: "DEVPKEY_NAME",
  },
  DEVPKEY_Device_Class: {
    name: "class",
    value: "class",
    keyName: "DEVPKEY_Device_Class",
  },
  DEVPKEY_Device_DeviceDesc: {
    name: "description",
    value: "description",
    keyName: "DEVPKEY_Device_DeviceDesc",
  },
  DEVPKEY_Device_Manufacturer: {
    name: "manufacturer",
    value: "manufacturer",
    keyName: "DEVPKEY_Device_Manufacturer",
  },
  DEVPKEY_Device_FriendlyName: {
    name: "friendly name",
    value: "friendly_name",
    keyName: "DEVPKEY_Device_FriendlyName",
  },
  DEVPKEY_Device_InstanceId: {
    name: "instance id",
    value: "instance_id",
    keyName: "DEVPKEY_Device_InstanceId",
  },
  DEVPKEY_Device_ContainerId: {
    name: "container id",
    value: "container_id",
    keyName: "DEVPKEY_Device_ContainerId",
  },
  "{104EA319-6EE2-4701-BD47-8DDBF425BBE5} 2": {
    name: "battery level",
    value: "battery_level",
    keyName: "'{104EA319-6EE2-4701-BD47-8DDBF425BBE5} 2'",
  },
  "{83DA6326-97A6-4088-9453-A1923F573B29} 15": {
    name: "connected",
    value: "connected",
    keyName: "'{83DA6326-97A6-4088-9453-A1923F573B29} 15'",
  },
};

export const POWERSHELL = {
  POWERSHELL_COMMAND,
  POWERSHELL_TEXT_ENCODING,
  POWERSHELL_CONVERT_TO_JSON,
  POWERSHELL_PROPERTIES: Object.values(PROPERTY_MAP)
    .map((property) => property.keyName)
    .join(", "),
};
