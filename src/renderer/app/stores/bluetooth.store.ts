import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { PROPERTY_MAP } from "@/constants/bluetooth";
import { useLocalStore } from "./local.store";

interface BluetoothStore {
  loadingDeviceInfo: boolean;
  loadingSystemInfoMap: Record<string, boolean>;

  loadingDevice: boolean;
  loadingProperty: boolean;
  loadingPropertyMap: Record<string, boolean>;
  deviceLoadingMessage: string | null;
  propertyLoadingMessage: string | null;

  bluetoothInfoMap: Record<string, any>;

  devices: Device[];
  deviceProperties: DeviceProperty[];
  selectedDevice: Device | null;
  selectedSystem: System | null;
  systemProperties: SystemProperty[];

  clearDeviceState: () => void;

  pullDeviceInfo: () => void;
  pullSystemInfo: (deviceInstanceId?: string) => void;

  getDeviceByClass: (className: string) => Promise<void>;
  getDevicePropertyById: (instanceId?: string) => Promise<void>;
}

export const useBluetoothStore = create<BluetoothStore>()(
  devtools(
    persist(
      (set, get) => ({
        loadingDeviceInfo: false,
        loadingSystemInfoMap: {},

        loadingDevice: false,
        loadingProperty: false,
        loadingPropertyMap: {},
        deviceLoadingMessage: null,
        propertyLoadingMessage: null,

        bluetoothInfoMap: {},

        devices: [],
        deviceProperties: [],
        selectedDevice: null,
        selectedSystem: null,
        systemProperties: [],

        clearDeviceState: () => {
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

        pullDeviceInfo: () => {
          const loadingDeviceInfo = get().loadingDeviceInfo;

          if (loadingDeviceInfo) return;

          set({ loadingDeviceInfo: true });

          const bluetooth = useLocalStore.getState().bluetooth;

          Promise.all(
            bluetooth.map((data) =>
              window.systemAPI.getDevicePropertyById(data.device.InstanceId).then((result) => {
                if (!result) return;

                const deviceProperties: DeviceProperty[] = JSON.parse(result);
                const device = deviceProperties
                  .filter((property) => !!PROPERTY_MAP?.[property.KeyName])
                  .reduce<Record<string, string>>((acc, cur) => {
                    const key = PROPERTY_MAP[cur.KeyName].value;

                    acc[key] = cur.Data.toString();

                    return acc;
                  }, {});

                console.log("get device info");

                set((p) => ({
                  bluetoothInfoMap: {
                    ...p.bluetoothInfoMap,
                    [data.device.InstanceId]: {
                      ...(p.bluetoothInfoMap[data.device.InstanceId] ?? {}),
                      device,
                    },
                  },
                }));
              }),
            ),
          ).then(() => {
            console.log("pull device info");

            set({ loadingDeviceInfo: false });
          });
        },
        pullSystemInfo: (deviceInstanceId) => {
          if (!deviceInstanceId) return;

          const loadingSystemInfoMap = get().loadingSystemInfoMap;

          if (loadingSystemInfoMap[deviceInstanceId]) return;

          set({ loadingSystemInfoMap: { ...loadingSystemInfoMap, [deviceInstanceId]: true } });

          const bluetooth = useLocalStore.getState().bluetooth;
          const data = bluetooth.find((data) => data?.device?.InstanceId === deviceInstanceId);

          if (!data) return;

          window.systemAPI.getSystemPropertyById(data.system.InstanceId).then((result) => {
            if (!result) return;

            const systemProperties: DeviceProperty[] = JSON.parse(result);
            const system = systemProperties
              .filter((property) => !!PROPERTY_MAP?.[property.KeyName])
              .reduce<Record<string, string>>((acc, cur) => {
                const key = PROPERTY_MAP[cur.KeyName].value;

                acc[key] = cur.Data.toString();

                return acc;
              }, {});

            console.log("pull system info");

            set((p) => ({
              loadingSystemInfoMap: {
                ...p.loadingSystemInfoMap,
                [deviceInstanceId]: false,
              },
              bluetoothInfoMap: {
                ...p.bluetoothInfoMap,
                [data.device.InstanceId]: {
                  ...(p.bluetoothInfoMap[data.device.InstanceId] ?? {}),
                  system,
                },
              },
            }));
          });
        },

        getDeviceByClass: async (className) => {
          try {
            const loadingDevice = get().loadingDevice;

            if (loadingDevice) return;

            set({ loadingDevice: true, deviceLoadingMessage: "Loading Device ..." });

            const result = await window.systemAPI.getDeviceByClass(className);

            if (!result) throw new Error("No Device Data");

            const devices: Device[] = JSON.parse(result);

            console.log("get device");

            set({ loadingDevice: false, deviceLoadingMessage: null, devices });
          } catch (error) {
            console.error(error);

            set({ loadingDevice: false, deviceLoadingMessage: null, devices: [] });
          }
        },
        getDevicePropertyById: async (instanceId) => {
          try {
            if (!instanceId) throw new Error("No Instance Id");

            const loadingPropertyMap = get().loadingPropertyMap;

            if (loadingPropertyMap[instanceId]) return;

            set({
              loadingProperty: true,
              loadingPropertyMap: { ...loadingPropertyMap, [instanceId]: true },
              propertyLoadingMessage: "Loading Device Property ...",
            });

            const devices = get().devices;
            const selectedDevice = devices.find((device) => device.InstanceId === instanceId);

            const devicePropertyResult = await window.systemAPI.getDevicePropertyById(instanceId);

            if (!devicePropertyResult) throw new Error("No Device Property");

            console.log("get device property");

            const deviceProperties: DeviceProperty[] = JSON.parse(devicePropertyResult);
            const filteredDeviceProperties = deviceProperties.filter((property) => !!PROPERTY_MAP?.[property.KeyName]);

            const containerId = filteredDeviceProperties.find(
              (property) => property.KeyName === "DEVPKEY_Device_ContainerId",
            )?.Data;

            if (!containerId) throw new Error("No Container Id");

            set({ propertyLoadingMessage: "Loading System ..." });

            const systemResult = await window.systemAPI.getSystemByContainerId(containerId);

            if (!systemResult) throw new Error("No System Data");

            console.log("get system");

            const system = JSON.parse(systemResult);

            if (!system.InstanceId) throw new Error("No System Instance Id");

            set({ propertyLoadingMessage: "Loading System Property ..." });

            const systemPropertyResult = await window.systemAPI.getSystemPropertyById(system.InstanceId);

            if (!systemPropertyResult) throw new Error("No System Property");

            console.log("get system property");

            const systemProperties: SystemProperty[] = JSON.parse(systemPropertyResult);
            const filteredSystemProperties = systemProperties.filter((property) => !!PROPERTY_MAP?.[property.KeyName]);

            set({
              loadingProperty: false,
              loadingPropertyMap: { ...loadingPropertyMap, [instanceId]: false },
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
              loadingPropertyMap: {},
              propertyLoadingMessage: null,
              deviceProperties: [],
              selectedDevice: null,
              selectedSystem: null,
              systemProperties: [],
            });
          }
        },
      }),
      {
        name: "system-store",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          loadingDevice: state.loadingDevice,
          loadingProperty: state.loadingProperty,
          loadingPropertyMap: state.loadingPropertyMap,
        }),
      },
    ),
  ),
);
