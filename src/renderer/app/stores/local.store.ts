import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

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
          bluetooth.push({ device, system });

          set({ bluetooth });
        },
      }),
      {
        name: "local-store",
        partialize: (state) => ({
          bluetooth: state.bluetooth,
        }),
      },
    ),
  ),
);
