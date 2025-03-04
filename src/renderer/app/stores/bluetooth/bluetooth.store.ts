import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface BluetoothStore {
  config: Record<string, number>;
  isDevToolsOpen: boolean;

  getConfig: () => Promise<void>;
  minimize: () => void;
  maximize: () => void;
  setDevtoolsStatus: (status: boolean) => void;
  openDevTools: () => Promise<void>;
  closeDevTools: () => Promise<void>;
  close: (config: Record<string, number>) => void;
}

export const useBluetoothStore = create<BluetoothStore>()(
  devtools((set) => ({
    config: {},
    isDevToolsOpen: false,

    getConfig: async () => {
      const config = (await window.bluetoothAppAPI.getConfig()) ?? {};

      set({ config });
    },
    minimize: () => {
      window.bluetoothAppAPI.minimize();
    },
    maximize: () => {
      window.bluetoothAppAPI.maximize();
    },
    setDevtoolsStatus: (status: boolean) => {
      set({ isDevToolsOpen: status });
    },
    openDevTools: async () => {
      await window.bluetoothAppAPI.openDevTools();
    },
    closeDevTools: async () => {
      await window.bluetoothAppAPI.closeDevTools();
    },
    close: (config: Record<string, number>) => {
      window.bluetoothAppAPI.setConfig(config);
      window.bluetoothAppAPI.close();
    },
  })),
);
