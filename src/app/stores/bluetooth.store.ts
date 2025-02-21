import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { PROPERTY_MAP } from "../constants/system.constant";

interface BluetoothStore {
  bluetooth: { device: Device; system: System }[];
  bluetoothInfoMap: Record<string, any>;

  addDevice: (device?: Device, system?: System) => void;
  pullDeviceInfo: () => void;
}

export const useBluetoothStore = create<BluetoothStore>()(
  devtools(
    persist(
      (set, get) => ({
        bluetooth: [],
        bluetoothInfoMap: {},

        addDevice: (device, system) => {
          if (!device || !system) return;

          const bluetooth = get().bluetooth;
          bluetooth.push({ device, system });

          set({ bluetooth });
        },
        pullDeviceInfo: () => {
          const bluetooth = get().bluetooth;

          for (const data of bluetooth) {
            window.electronAPI.getDevicePropertyById(data.device.InstanceId).then((result: string) => {
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
            });

            window.electronAPI.getSystemPropertyById(data.system.InstanceId).then((result: string) => {
              if (!result) return;

              const systemProperties: DeviceProperty[] = JSON.parse(result);
              const system = systemProperties
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
                    system,
                  },
                },
              }));
            });
          }
        },
      }),
      {
        name: "bluetooth-store",
        partialize: (state) => ({
          bluetooth: state.bluetooth,
          bluetoothInfoMap: state.bluetoothInfoMap,
        }),
      },
    ),
  ),
);
