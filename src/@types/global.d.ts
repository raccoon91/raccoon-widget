type Nullish<T> = T | null | undefined;

type Nullable<T> = T | null;

interface AppAPI {
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
  isDevToolsOpened: () => Promise<boolean>;
  openDevTools: () => Promise<void>;
  closeDevTools: () => Promise<void>;
  close: () => Promise<void>;
  isChildDevToolsOpened: (path: string) => Promise<boolean>;
  openChildDevTools: (path: string) => Promise<void>;
  closeChildDevTools: (path: string) => Promise<void>;
  closeChild: (path: string) => Promise<void>;
  getAppConfig: () => Promise<string>;
  setAppConfig: (data?: string) => Promise<void>;
}

interface StorageAPI {
  getStorage: () => Promise<any>;
  setStorage: (data: any) => Promise<any>;
  getSession: () => Promise<any>;
  setSession: (data: any) => Promise<any>;
}

interface BluetoothAPI {
  getDeviceByClass: (className: string) => Promise<Nullish<string>>;
  getDevicePropertyById: (instanceId: string) => Promise<Nullish<string>>;
  getSystemByContainerId: (containerId: string | string[]) => Promise<Nullish<string>>;
  getSystemPropertyById: (containerId: string | string[]) => Promise<Nullish<string>>;
  getSystemPropertyByContainerId: (containerId: string) => Promise<Nullish<string>>;
}

interface WidgetAPI {
  preventFromAeroPeek: () => Promise<void>;
  preventFromShowDesktop: () => Promise<void>;
  cancelPreventFromShowDesktop: () => Promise<void>;
  moveToBottom: () => Promise<void>;
  alwaysOnBottom: () => Promise<void>;
  cancelAlwaysOnBottom: () => Promise<void>;
}

interface Window {
  electron: ElectronAPI;
  appAPI: AppAPI;
  storageAPI: StorageAPI;
  bluetoothAPI: BluetoothAPI;
  widgetAPI: WidgetAPI;
}
