interface AppAPI {
  getConfig: () => Promise<Nullable<Record<string, number>>>;
  setConfig: (data?: Record<string, number>) => Promise<void>;
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
  devtoolsStatusChanged: (callback: (event: IpcRendererEvent, args: any) => void) => IpcRenderer;
  removeDevtoolsStatusChanged: () => IpcRenderer;
  openDevTools: () => Promise<void>;
  closeDevTools: () => Promise<void>;
  close: () => Promise<void>;
}

interface MainAppAPI {
  openBluetoothApp: () => Promise<void>;
  closeBluetoothApp: () => Promise<void>;
}

interface StorageAPI {
  getStorage: () => Promise<any>;
  setStorage: (data: any) => Promise<any>;
  storageChanged: (callback: (event: IpcRendererEvent, args: boolean) => void) => IpcRenderer;
  removeStorageChanged: () => IpcRenderer;

  getSession: () => Promise<any>;
  setSession: (data: any) => Promise<any>;
  sessionChanged: (callback: (event: IpcRendererEvent, args: boolean) => void) => IpcRenderer;
  removeSessionChanged: () => IpcRenderer;
}

interface ShellAPI {
  getDeviceByClass: <T = Record<string, any>>(className: string) => Promise<Nullable<T[]>>;
  getDevicePropertyById: <T = Record<string, any>>(instanceId: string) => Promise<Nullable<T[]>>;
  getSystemByContainerId: <T = Record<string, any>>(containerId: string | string[]) => Promise<Nullable<T>>;
  getSystemPropertyById: <T = Record<string, any>>(containerId: string | string[]) => Promise<Nullable<T[]>>;
  getSystemPropertyByContainerId: <T = Record<string, any>>(containerId: string) => Promise<Nullable<T[]>>;
}

interface WidgetAPI {
  preventFromAeroPeek: () => Promise<void>;
  preventFromShowDesktop: () => Promise<void>;
  cancelPreventFromShowDesktop: () => Promise<void>;
  moveToBottom: () => Promise<void>;
  alwaysOnBottom: () => Promise<void>;
  cancelAlwaysOnBottom: () => Promise<void>;
}
