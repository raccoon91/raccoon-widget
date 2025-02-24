import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface AppStore {
  mode: string;
  isDevToolsOpen: boolean;

  initAppInfo: () => Promise<void>;

  openDevTools: () => Promise<void>;
  closeDevTools: () => Promise<void>;

  changeToDisplayMode: () => void;
  changeToSettingMode: () => void;

  minimize: () => void;
  maximize: () => void;
  close: () => void;
}

export const useAppStore = create<AppStore>()(
  devtools((set) => ({
    mode: "display",
    isDevToolsOpen: false,

    initAppInfo: async () => {
      const isDevToolsOpen = await window.appAPI.isDevToolsOpened();

      set({ isDevToolsOpen });
    },

    openDevTools: async () => {
      await window.appAPI.openDevTools();

      set({ isDevToolsOpen: true });
    },
    closeDevTools: async () => {
      await window.appAPI.closeDevTools();

      set({ isDevToolsOpen: false });
    },

    changeToDisplayMode: () => {
      window.widgetAPI.alwaysOnBottom();

      set({ mode: "display" });
    },
    changeToSettingMode: () => {
      window.widgetAPI.cancelAlwaysOnBottom();

      set({ mode: "setting" });
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
