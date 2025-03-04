import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const bluetoothStorage = {
  getItem: async (key: string) => {
    const storage = await window.bluetoothStorageAPI.getStorage();

    return storage[key];
  },
  setItem: async (key: string, value: any) => {
    const storage = await window.bluetoothStorageAPI.getStorage();

    window.bluetoothStorageAPI.setStorage({
      ...storage,
      [key]: value,
    });
  },
  removeItem: async (key: string) => {
    const storage = await window.bluetoothStorageAPI.getStorage();

    delete storage[key];

    window.bluetoothStorageAPI.setStorage(storage);
  },
};

interface BluetoothStorageStore {
  bluetooth: {
    device: Device;
    system: System;
  }[];
  addDevice: (device?: Nullable<Device>, system?: Nullable<System>) => void;
}

export const useBluetoothStorageStore = create<BluetoothStorageStore>()(
  devtools(
    persist(
      (set, get) => ({
        bluetooth: [],

        addDevice: (device, system) => {
          if (!device || !system) return;

          const bluetooth = get().bluetooth;

          const bluetoothMap = bluetooth.reduce<Record<string, boolean>>((acc, cur) => {
            acc[cur.device.InstanceId] = true;

            return acc;
          }, {});

          if (bluetoothMap[device.InstanceId]) return;

          bluetooth.push({ device, system });

          set({ bluetooth });
        },
      }),
      {
        name: "storage-store",
        skipHydration: true,
        storage: createJSONStorage(() => bluetoothStorage),
        partialize: (state) => ({
          bluetooth: state.bluetooth,
        }),
      },
    ),
  ),
);
