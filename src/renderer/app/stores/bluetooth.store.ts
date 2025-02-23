import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { PROPERTY_MAP } from "@/constants/system";

interface BluetoothStore {
  loadingDevice: boolean;
  loadingSystemMap: Record<string, boolean>;

  bluetooth: { device: Device; system: System }[];
  bluetoothInfoMap: Record<string, any>;

  addDevice: (device?: Nullable<Device>, system?: Nullable<System>) => void;

  pullDeviceInfo: () => void;
  pullSystemInfo: (deviceInstanceId?: string) => void;
}

export const useBluetoothStore = create<BluetoothStore>()(
  devtools(
    persist(
      (set, get) => ({
        loadingDevice: false,
        loadingSystemMap: {},

        bluetooth: [],
        bluetoothInfoMap: {},

        addDevice: (device, system) => {
          if (!device || !system) return;

          const bluetooth = get().bluetooth;
          bluetooth.push({ device, system });

          set({ bluetooth });
        },

        pullDeviceInfo: () => {
          const loadingDevice = get().loadingDevice;

          if (loadingDevice) return;

          set({ loadingDevice: true });

          const bluetooth = get().bluetooth;

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

            set({ loadingDevice: false });
          });
        },
        pullSystemInfo: (deviceInstanceId) => {
          if (!deviceInstanceId) return;

          const loadingSystemMap = get().loadingSystemMap;

          if (loadingSystemMap[deviceInstanceId]) return;

          set({ loadingSystemMap: { ...loadingSystemMap, [deviceInstanceId]: true } });

          const bluetooth = get().bluetooth;
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
              loadingSystemMap: {
                ...p.loadingSystemMap,
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
      }),
      {
        name: "bluetooth-store",
        partialize: (state) => ({
          loadingDevice: state.loadingDevice,
          loadingSystemMap: state.loadingSystemMap,
          bluetooth: state.bluetooth,
        }),
      },
    ),
  ),
);
