import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface AppStore {
  mode: string;
  config: Record<string, number>;
  isDevToolsOpen: boolean;

  configMap: Record<string, Record<string, number>>;
  isChildDevToolsOpenMap: Record<string, boolean>;

  changeToDisplayMode: (config: Record<string, number>) => void;
  changeToSettingMode: () => void;

  getAppConfig: () => Promise<void>;
  minimize: () => void;
  maximize: () => void;
  setDevtoolsStatus: (status: boolean) => void;
  openDevTools: () => Promise<void>;
  closeDevTools: () => Promise<void>;
  close: () => void;

  getAppChildConfig: (path: string) => Promise<void>;
  openChildDevTools: (path: string) => Promise<void>;
  closeChildDevTools: (path: string) => Promise<void>;
  closeChild: (path: string, config?: Record<string, number>) => void;
}

export const useAppStore = create<AppStore>()(
  devtools((set) => ({
    mode: "display",
    isDevToolsOpen: false,

    configMap: {},
    isChildDevToolsOpenMap: {},

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

      set({ isDevToolsOpen: true });
    },
    closeDevTools: async () => {
      await window.appAPI.closeDevTools();

      set({ isDevToolsOpen: false });
    },
    close: () => {
      window.appAPI.close();
    },

    getAppChildConfig: async (path) => {
      const config = (await window.appAPI.getAppChildConfig(path)) ?? {};

      set((p) => ({
        configMap: {
          ...p.configMap,
          [path]: config,
        },
        isChildDevToolsOpenMap: {
          ...p.isChildDevToolsOpenMap,
          [path]: false,
        },
      }));
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
    closeChild: async (path: string, config?: Record<string, number>) => {
      if (config) window.appAPI.setAppChildConfig(path, config);

      window.appAPI.closeChild(path);
    },
  })),
);
