import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const appSharedStorage = {
  getItem: async (key: string) => {
    const storage = await window.storageAPI.getStorage();

    return storage[key];
  },
  setItem: async (key: string, value: any) => {
    const storage = await window.storageAPI.getStorage();

    window.storageAPI.setStorage({
      ...storage,
      [key]: value,
    });
  },
  removeItem: async (key: string) => {
    const storage = await window.storageAPI.getStorage();

    delete storage[key];

    window.storageAPI.setStorage(storage);
  },
};

interface SharedState {
  bluetooth: {
    device: Device;
    system: System;
  }[];
}

interface SharedAction {
  addDevice: (device?: Nullable<Device>, system?: Nullable<System>) => void;
}

export const useSharedStore = create<SharedState & SharedAction>()(
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
        name: "shared-store",
        storage: createJSONStorage(() => appSharedStorage),
        partialize: (state) => ({
          bluetooth: state.bluetooth,
        }),
      },
    ),
  ),
);
