import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface AppStore {
  mode: string;
  config: Record<string, number>;
  isDevToolsOpen: boolean;

  initAppInfo: () => Promise<void>;

  openDevTools: () => Promise<void>;
  closeDevTools: () => Promise<void>;

  changeToDisplayMode: (width: number, height: number, x: number, y: number) => void;
  changeToSettingMode: () => void;

  minimize: () => void;
  maximize: () => void;
  close: () => void;
}

export const useAppStore = create<AppStore>()(
  devtools((set, get) => ({
    mode: "display",
    isDevToolsOpen: false,

    initAppInfo: async () => {
      const stringConfig = await window.appAPI.getAppConfig();

      const config = stringConfig ? JSON.parse(stringConfig) : {};

      const isDevToolsOpen = await window.appAPI.isDevToolsOpened();

      set({ config, isDevToolsOpen });
    },

    openDevTools: async () => {
      await window.appAPI.openDevTools();

      set({ isDevToolsOpen: true });
    },
    closeDevTools: async () => {
      await window.appAPI.closeDevTools();

      set({ isDevToolsOpen: false });
    },

    changeToDisplayMode: (width, height, x, y) => {
      window.widgetAPI.alwaysOnBottom();

      const config = get().config;
      const newConfig = {
        ...config,
        width,
        height,
        x,
        y,
      };

      const stringConfig = JSON.stringify(newConfig);

      window.appAPI.setAppConfig(stringConfig);

      set({ mode: "display", config: newConfig });
    },
    changeToSettingMode: async () => {
      window.widgetAPI.cancelAlwaysOnBottom();

      const stringConfig = await window.appAPI.getAppConfig();

      const config = stringConfig ? JSON.parse(stringConfig) : {};

      set({ mode: "setting", config });
    },

    minimize: () => {
      window.appAPI.minimize();
    },
    maximize: () => {
      window.appAPI.maximize();
    },
    close: () => {
      window.appAPI.close();
    },
  })),
);
