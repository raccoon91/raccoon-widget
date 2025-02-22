type Nullish<T> = T | null | undefined;

type Nullable<T> = T | null;

interface AppAPI {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
}

interface SystemAPI {
  getDeviceByClass: (className: string) => Promise<Nullish<string>>;
  getDevicePropertyById: (instanceId: string) => Promise<Nullish<string>>;
  getSystemByContainerId: (containerId: string | string[]) => Promise<Nullish<string>>;
  getSystemPropertyById: (containerId: string | string[]) => Promise<Nullish<string>>;
  getSystemPropertyByContainerId: (containerId: string) => Promise<Nullish<string>>;
}

interface WidgetAPI {
  preventFromAeroPeek: () => void;
  preventFromShowDesktop: () => void;
  cancelPreventFromShowDesktop: () => void;
  moveToBottom: () => void;
  alwaysOnBottom: () => void;
  cancelAlwaysOnBottom: () => void;
}

interface Window {
  electron: ElectronAPI;
  appAPI: AppAPI;
  systemAPI: SystemAPI;
  widgetAPI: WidgetAPI;
}
