import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { PROPERTY_MAP } from "@/constants/shell";
import { useBluetoothStorageStore } from "./bluetooth-storage.store";

const bluetoothSession = {
  getItem: async (key: string) => {
    const session = await window.bluetoothStorageAPI.getSession();

    return session[key];
  },
  setItem: async (key: string, value: any) => {
    const session = await window.bluetoothStorageAPI.getSession();

    window.bluetoothStorageAPI.setSession({
      ...session,
      [key]: value,
    });
  },
  removeItem: async (key: string) => {
    const session = await window.bluetoothStorageAPI.getSession();

    delete session[key];

    window.bluetoothStorageAPI.setSession(session);
  },
};

interface BluetoothSessionStore {
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

export const useBluetoothSessionStore = create<BluetoothSessionStore>()(
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

          const bluetooth = useBluetoothStorageStore.getState().bluetooth;

          Promise.all(
            bluetooth.map((data) =>
              window.shellAPI.getDevicePropertyById(data.device.InstanceId).then((result) => {
                if (!result) return;

                const device = result
                  .filter((property) => !!PROPERTY_MAP?.[property.KeyName])
                  .reduce<Record<string, string>>((acc, cur) => {
                    const key = PROPERTY_MAP[cur.KeyName].value;

                    acc[key] = cur.Data.toString();

                    return acc;
                  }, {});

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
            set({ loadingDeviceInfo: false });
          });
        },
        pullSystemInfo: (deviceInstanceId) => {
          if (!deviceInstanceId) return;

          const loadingSystemInfoMap = get().loadingSystemInfoMap;

          if (loadingSystemInfoMap[deviceInstanceId]) return;

          set({ loadingSystemInfoMap: { ...loadingSystemInfoMap, [deviceInstanceId]: true } });

          const bluetooth = useBluetoothStorageStore.getState().bluetooth;
          const data = bluetooth.find((data) => data?.device?.InstanceId === deviceInstanceId);

          if (!data) return;

          window.shellAPI.getSystemPropertyById(data.system.InstanceId).then((result) => {
            if (!result) return;

            const system = result
              .filter((property) => !!PROPERTY_MAP?.[property.KeyName])
              .reduce<Record<string, string>>((acc, cur) => {
                const key = PROPERTY_MAP[cur.KeyName].value;

                acc[key] = cur.Data.toString();

                return acc;
              }, {});

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

            const bluetooth = useBluetoothStorageStore.getState().bluetooth;

            const bluetoothMap = bluetooth.reduce<Record<string, boolean>>((acc, cur) => {
              acc[cur.device.InstanceId] = true;

              return acc;
            }, {});

            set({ loadingDevice: true, deviceLoadingMessage: "Loading Device ..." });

            const result = await window.shellAPI.getDeviceByClass<Device>(className);

            if (!result) throw new Error("No Device Data");

            const filteredDevices = result.filter((device) => !bluetoothMap[device.InstanceId]);

            set({ loadingDevice: false, deviceLoadingMessage: null, devices: filteredDevices });
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

            const deviceProperties = await window.shellAPI.getDevicePropertyById<DeviceProperty>(instanceId);

            if (!deviceProperties) throw new Error("No Device Property");

            const containerId = deviceProperties.find(
              (property) => property.KeyName === "DEVPKEY_Device_ContainerId",
            )?.Data;

            if (!containerId) throw new Error("No Container Id");

            set({ propertyLoadingMessage: "Loading System ..." });

            const system = await window.shellAPI.getSystemByContainerId<System>(containerId);

            if (!system) throw new Error("No System Data");

            if (!system?.InstanceId) throw new Error("No System Instance Id");

            set({ propertyLoadingMessage: "Loading System Property ..." });

            const systemProperties = await window.shellAPI.getSystemPropertyById<SystemProperty>(system.InstanceId);

            if (!systemProperties) throw new Error("No System Property");

            set({
              loadingProperty: false,
              loadingPropertyMap: { ...loadingPropertyMap, [instanceId]: false },
              propertyLoadingMessage: null,
              deviceProperties,
              selectedDevice,
              selectedSystem: system,
              systemProperties,
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
        name: "session-store",
        skipHydration: true,
        storage: createJSONStorage(() => bluetoothSession),
        partialize: (state) => ({
          loadingDeviceInfo: state.loadingDeviceInfo,
          loadingSystemInfoMap: state.loadingSystemInfoMap,
          loadingDevice: state.loadingDevice,
          loadingProperty: state.loadingProperty,
          loadingPropertyMap: state.loadingPropertyMap,
          deviceLoadingMessage: state.deviceLoadingMessage,
          propertyLoadingMessage: state.propertyLoadingMessage,
          bluetoothInfoMap: state.bluetoothInfoMap,
          devices: state.devices,
        }),
      },
    ),
  ),
);
