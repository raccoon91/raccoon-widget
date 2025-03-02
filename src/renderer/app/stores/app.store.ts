import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface AppStore {
  mode: string;
  config: Record<string, number>;
  isDevToolsOpen: boolean;

  changeToDisplayMode: (config: Record<string, number>) => void;
  changeToSettingMode: () => void;

  getAppConfig: () => Promise<void>;
  minimize: () => void;
  maximize: () => void;
  setDevtoolsStatus: (status: boolean) => void;
  openDevTools: () => Promise<void>;
  closeDevTools: () => Promise<void>;
  close: () => void;
}

export const useAppStore = create<AppStore>()(
  devtools((set) => ({
    mode: "display",
    config: {},
    isDevToolsOpen: false,

    changeToDisplayMode: (config) => {
      window.widgetAPI.alwaysOnBottom();

      window.appAPI.setAppConfig(config);

      set({ mode: "display", config });
    },
    changeToSettingMode: async () => {
      window.widgetAPI.cancelAlwaysOnBottom();

      const config = (await window.appAPI.getAppConfig()) ?? {};

      set({ mode: "setting", config });
    },

    getAppConfig: async () => {
      const config = (await window.appAPI.getAppConfig()) ?? {};

      set({ config });
    },
    minimize: () => {
      window.appAPI.minimize();
    },
    maximize: () => {
      window.appAPI.maximize();
    },
    setDevtoolsStatus: (status: boolean) => {
      set({ isDevToolsOpen: status });
    },
    openDevTools: async () => {
      await window.appAPI.openDevTools();
    },
    closeDevTools: async () => {
      await window.appAPI.closeDevTools();
    },
    close: () => {
      window.appAPI.close();
    },
  })),
);
