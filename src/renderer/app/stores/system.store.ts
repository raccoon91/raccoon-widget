import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { PROPERTY_MAP } from "@/constants/system";

interface SystemStore {
  loadingDevice: boolean;
  loadingProperty: boolean;
  deviceLoadingMessage: string | null;
  propertyLoadingMessage: string | null;

  devices: Device[];
  deviceProperties: DeviceProperty[];
  selectedDevice: Device | null;
  selectedSystem: System | null;
  systemProperties: SystemProperty[];

  clearState: () => void;

  getDeviceByClass: (className: string) => Promise<void>;
  getDevicePropertyById: (instanceId?: string) => Promise<void>;
  getSystemByContainerId: (containerId?: string) => Promise<void>;
}

export const useSystemStore = create<SystemStore>()(
  devtools((set, get) => ({
    loadingDevice: false,
    loadingProperty: false,
    deviceLoadingMessage: null,
    propertyLoadingMessage: null,

    devices: [],
    deviceProperties: [],
    selectedDevice: null,
    selectedSystem: null,
    systemProperties: [],

    clearState: () => {
      set({
        loadingDevice: false,
        loadingProperty: false,
        deviceLoadingMessage: null,
        propertyLoadingMessage: null,
        deviceProperties: [],
        selectedDevice: null,
        selectedSystem: null,
        systemProperties: [],
      });
    },

    getDeviceByClass: async (className) => {
      try {
        set({ loadingDevice: true, deviceLoadingMessage: "Loading Device ..." });

        const result = await window.api.getDeviceByClass(className);

        if (!result) throw new Error("No Device Data");

        const devices: Device[] = JSON.parse(result);

        set({ loadingDevice: false, deviceLoadingMessage: null, devices });
      } catch (error) {
        console.error(error);

        set({ loadingDevice: false, deviceLoadingMessage: null, devices: [] });
      }
    },
    getDevicePropertyById: async (instanceId) => {
      try {
        if (!instanceId) throw new Error("No Instance Id");

        set({ loadingProperty: true, propertyLoadingMessage: "Loading Device Property ..." });

        const devices = get().devices;
        const selectedDevice = devices.find((device) => device.InstanceId === instanceId);

        const devicePropertyResult = await window.api.getDevicePropertyById(instanceId);

        if (!devicePropertyResult) throw new Error("No Device Property");

        const deviceProperties: DeviceProperty[] = JSON.parse(devicePropertyResult);
        const filteredDeviceProperties = deviceProperties.filter((property) => !!PROPERTY_MAP?.[property.KeyName]);

        const containerId = filteredDeviceProperties.find(
          (property) => property.KeyName === "DEVPKEY_Device_ContainerId",
        )?.Data;

        if (!containerId) throw new Error("No Container Id");

        set({ propertyLoadingMessage: "Loading System ..." });

        const systemResult = await window.api.getSystemByContainerId(containerId);

        if (!systemResult) throw new Error("No System Data");

        const system = JSON.parse(systemResult);

        if (!system.InstanceId) throw new Error("No System Instance Id");

        set({ propertyLoadingMessage: "Loading System Property ..." });

        const systemPropertyResult = await window.api.getSystemPropertyById(system.InstanceId);

        if (!systemPropertyResult) throw new Error("No System Property");

        const systemProperties: SystemProperty[] = JSON.parse(systemPropertyResult);
        const filteredSystemProperties = systemProperties.filter((property) => !!PROPERTY_MAP?.[property.KeyName]);

        set({
          loadingProperty: false,
          propertyLoadingMessage: null,
          deviceProperties: filteredDeviceProperties,
          selectedDevice,
          selectedSystem: system,
          systemProperties: filteredSystemProperties,
        });
      } catch (error) {
        console.error(error);

        set({
          loadingProperty: false,
          propertyLoadingMessage: null,
          deviceProperties: [],
          selectedDevice: null,
          selectedSystem: null,
          systemProperties: [],
        });
      }
    },
  })),
);
