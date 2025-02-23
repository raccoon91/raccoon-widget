import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface AppStore {
  mode: string;

  changeToDisplayMode: () => void;
  changeToSettingMode: () => void;

  minimize: () => void;
  maximize: () => void;
  close: () => void;
}

export const useAppStore = create<AppStore>()(
  devtools((set) => ({
    mode: "display",

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
