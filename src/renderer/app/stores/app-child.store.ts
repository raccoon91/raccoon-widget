import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface AppChildStore {
  configMap: Record<string, Record<string, number>>;
  isChildDevToolsOpenMap: Record<string, boolean>;

  getAppChildConfig: (path: string) => Promise<void>;
  setChildDevtoolsStatus: (path: string, status: boolean) => void;
  openChildDevTools: (path: string) => Promise<void>;
  closeChildDevTools: (path: string) => Promise<void>;
  closeChild: (path: string, config?: Record<string, number>) => void;
}

export const useAppChildStore = create<AppChildStore>()(
  devtools((set) => ({
    configMap: {},
    isChildDevToolsOpenMap: {},

    getAppChildConfig: async (path) => {
      const config = (await window.appChildAPI.getAppChildConfig(path)) ?? {};

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
    setChildDevtoolsStatus: (path: string, status: boolean) => {
      set((p) => ({
        isChildDevToolsOpenMap: {
          ...p.isChildDevToolsOpenMap,
          [path]: status,
        },
      }));
    },
    openChildDevTools: async (path: string) => {
      await window.appChildAPI.openChildDevTools(path);
    },
    closeChildDevTools: async (path: string) => {
      await window.appChildAPI.closeChildDevTools(path);
    },
    closeChild: async (path: string, config?: Record<string, number>) => {
      if (config) window.appChildAPI.setAppChildConfig(path, config);

      window.appChildAPI.closeChild(path);
    },
  })),
);
