import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const appLocalStorage = {
  getItem: async (key: string) => {
    const storage = await window.storageAPI.getStorage();

    console.log("get store");

    return storage[key];
  },
  setItem: async (key: string, value: any) => {
    const storage = await window.storageAPI.getStorage();

    console.log("set store");

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

interface LocalStore {
  bluetooth: { device: Device; system: System }[];

  addDevice: (device?: Nullable<Device>, system?: Nullable<System>) => void;
}

export const useLocalStore = create<LocalStore>()(
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
        name: "local-store",
        storage: createJSONStorage(() => appLocalStorage),
        partialize: (state) => ({
          bluetooth: state.bluetooth,
        }),
      },
    ),
  ),
);
