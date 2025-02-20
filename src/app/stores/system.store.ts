import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { PROPERTY_MAP } from "../constants/system";

interface SystemStore {
  loading: boolean;

  devices: Device[];
  deviceProperties: DeviceProperty[];
  system: System | null;
  systemProperties: SystemProperty[];

  getDeviceByClass: (className: string) => Promise<void>;
  getDevicePropertyById: (instanceId?: string) => Promise<void>;
  getSystemByContainerId: (containerId?: string) => Promise<void>;
}

export const useSystemStore = create<SystemStore>()(
  devtools(
    persist(
      (set) => ({
        loading: false,

        devices: [],
        deviceProperties: [],
        system: null,
        systemProperties: [],

        getDeviceByClass: async (className) => {
          try {
            set({ loading: true });

            const result = await window.electronAPI.getDeviceByClass(className);

            if (!result) {
              set({ loading: false, devices: [] });

              return;
            }

            const devices: Device[] = JSON.parse(result);

            set({ loading: false, devices });
          } catch (error) {
            console.error(error);

            set({ loading: false });
          }
        },
        getDevicePropertyById: async (instanceId) => {
          try {
            if (!instanceId) {
              set({ loading: false, deviceProperties: [] });

              return;
            }

            set({ loading: true });

            const result = await window.electronAPI.getDevicePropertyById(instanceId);

            if (!result) {
              set({ loading: false, deviceProperties: [] });

              return;
            }

            const properties: DeviceProperty[] = JSON.parse(result);
            const filteredProperties = properties.filter((property) => !!PROPERTY_MAP?.[property.KeyName]);

            set({ loading: false, deviceProperties: filteredProperties });
          } catch (error) {
            console.error(error);

            set({ loading: false });
          }
        },
        getSystemByContainerId: async (containerId) => {
          try {
            if (!containerId) {
              set({ loading: false, system: null, systemProperties: [] });

              return;
            }

            set({ loading: true });

            const systemResult = await window.electronAPI.getSystemByContainerId(containerId);

            if (!systemResult) {
              set({ loading: false, system: null, systemProperties: [] });

              return;
            }

            const system = JSON.parse(systemResult);

            if (!system.InstanceId) return;

            const propertyResult = await window.electronAPI.getSystemPropertyById(system.InstanceId);

            if (!propertyResult) {
              set({ loading: false, system: null });

              return;
            }

            const properties: SystemProperty[] = JSON.parse(propertyResult);
            const filteredProperties = properties.filter((property) => !!PROPERTY_MAP?.[property.KeyName]);

            set({ loading: false, system, systemProperties: filteredProperties });
          } catch (error) {
            console.error(error);

            set({ loading: false });
          }
        },
      }),
      {
        name: "system-store",
        partialize: (state) => ({ devices: state.devices }),
      },
    ),
  ),
);
