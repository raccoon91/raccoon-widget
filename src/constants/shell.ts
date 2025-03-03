export const POWERSHELL_COMMAND = "powershell -Command";

export const POWERSHELL_TEXT_ENCODING = "[System.Console]::OutputEncoding = [System.Text.Encoding]::UTF8";

export const POWERSHELL_CONVERT_TO_JSON = "ConvertTo-Json";

export const PROPERTY_MAP: Record<string, Record<string, string>> = {
  DEVPKEY_NAME: {
    name: "name",
    value: "name",
  },
  DEVPKEY_Device_Class: {
    name: "class",
    value: "class",
  },
  DEVPKEY_Device_DeviceDesc: {
    name: "description",
    value: "description",
  },
  DEVPKEY_Device_Manufacturer: {
    name: "manufacturer",
    value: "manufacturer",
  },
  DEVPKEY_Device_FriendlyName: {
    name: "friendly name",
    value: "friendly_name",
  },
  DEVPKEY_Device_InstanceId: {
    name: "instance id",
    value: "instance_id",
  },
  DEVPKEY_Device_ContainerId: {
    name: "container id",
    value: "container_id",
  },
  "{104EA319-6EE2-4701-BD47-8DDBF425BBE5} 2": {
    name: "battery level",
    value: "battery_level",
  },
  "{83DA6326-97A6-4088-9453-A1923F573B29} 15": {
    name: "connected",
    value: "connected",
  },
};

export const PROPERTY_KEY_NAMES = Object.keys(PROPERTY_MAP).map((key) => `'${key}'`);

export const POWERSHELL = {
  POWERSHELL_COMMAND,
  POWERSHELL_TEXT_ENCODING,
  POWERSHELL_CONVERT_TO_JSON,
  POWERSHELL_PROPERTIES: Object.values(PROPERTY_MAP)
    .map((property) => property.keyName)
    .join(", "),
};
