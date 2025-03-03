import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface AppStore {
  mode: string;
  config: Record<string, number>;
  isDevToolsOpen: boolean;

  changeToDisplayMode: (config: Record<string, number>) => void;
  changeToSettingMode: () => void;

  getConfig: () => Promise<void>;
  minimize: () => void;
  maximize: () => void;
  setDevtoolsStatus: (status: boolean) => void;
  openDevTools: () => Promise<void>;
  closeDevTools: () => Promise<void>;
  close: (config: Record<string, number>) => void;
}

export const useAppStore = create<AppStore>()(
  devtools((set) => ({
    mode: "display",
    config: {},
    isDevToolsOpen: false,

    changeToDisplayMode: (config) => {
      window.widgetAPI.alwaysOnBottom();

      window.mainAppAPI.setConfig(config);

      set({ mode: "display", config });
    },
    changeToSettingMode: async () => {
      window.widgetAPI.cancelAlwaysOnBottom();

      const config = (await window.mainAppAPI.getConfig()) ?? {};

      set({ mode: "setting", config });
    },

    getConfig: async () => {
      const config = (await window.mainAppAPI.getConfig()) ?? {};

      set({ config });
    },
    minimize: () => {
      window.mainAppAPI.minimize();
    },
    maximize: () => {
      window.mainAppAPI.maximize();
    },
    setDevtoolsStatus: (status: boolean) => {
      set({ isDevToolsOpen: status });
    },
    openDevTools: async () => {
      await window.mainAppAPI.openDevTools();
    },
    closeDevTools: async () => {
      await window.mainAppAPI.closeDevTools();
    },
    close: (config: Record<string, number>) => {
      window.mainAppAPI.setConfig(config);
      window.mainAppAPI.close();
    },
  })),
);
