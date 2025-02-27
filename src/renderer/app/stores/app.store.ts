import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface AppStore {
  mode: string;
  config: Record<string, number>;
  isDevToolsOpen: boolean;
  isChildDevToolsOpenMap: Record<string, boolean>;

  initAppInfo: () => Promise<void>;
  initChildAppInfo: (path: string) => Promise<void>;

  changeToDisplayMode: (width: number, height: number, x: number, y: number) => void;
  changeToSettingMode: () => void;

  minimize: () => void;
  maximize: () => void;
  openDevTools: () => Promise<void>;
  closeDevTools: () => Promise<void>;
  close: () => void;

  openChildDevTools: (path: string) => Promise<void>;
  closeChildDevTools: (path: string) => Promise<void>;
  closeChild: (path: string) => void;
}

export const useAppStore = create<AppStore>()(
  devtools((set, get) => ({
    mode: "display",
    isDevToolsOpen: false,

    initAppInfo: async () => {
      const config = (await window.appAPI.getAppConfig()) ?? {};

      const isDevToolsOpen = await window.appAPI.isDevToolsOpened();

      set({ config, isDevToolsOpen });
    },
    initChildAppInfo: async (path) => {
      const isChildDevToolsOpen = await window.appAPI.isChildDevToolsOpened(path);

      set((p) => ({
        isChildDevToolsOpenMap: {
          ...p.isChildDevToolsOpenMap,
          [path]: isChildDevToolsOpen,
        },
      }));
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

      window.appAPI.setAppConfig(newConfig);

      set({ mode: "display", config: newConfig });
    },
    changeToSettingMode: async () => {
      window.widgetAPI.cancelAlwaysOnBottom();

      const config = (await window.appAPI.getAppConfig()) ?? {};

      set({ mode: "setting", config });
    },

    minimize: () => {
      window.appAPI.minimize();
    },
    maximize: () => {
      window.appAPI.maximize();
    },
    openDevTools: async () => {
      await window.appAPI.openDevTools();

      set({ isDevToolsOpen: true });
    },
    closeDevTools: async () => {
      await window.appAPI.closeDevTools();

      set({ isDevToolsOpen: false });
    },
    close: () => {
      window.appAPI.close();
    },

    openChildDevTools: async (path: string) => {
      await window.appAPI.openChildDevTools(path);

      set((p) => ({
        isChildDevToolsOpenMap: {
          ...p.isChildDevToolsOpenMap,
          [path]: true,
        },
      }));
    },
    closeChildDevTools: async (path: string) => {
      await window.appAPI.closeChildDevTools(path);

      set((p) => ({
        isChildDevToolsOpenMap: {
          ...p.isChildDevToolsOpenMap,
          [path]: false,
        },
      }));
    },
    closeChild: (path: string) => {
      window.appAPI.closeChild(path);
    },
  })),
);
