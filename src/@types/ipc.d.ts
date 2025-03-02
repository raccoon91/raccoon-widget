interface AppAPI {
  getAppConfig: () => Promise<Nullable<Record<string, number>>>;
  setAppConfig: (data?: Record<string, number>) => Promise<void>;
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
  devtoolsStatusChanged: (callback: (event: IpcRendererEvent, args: any) => void) => IpcRenderer;
  openDevTools: () => Promise<void>;
  closeDevTools: () => Promise<void>;
  close: () => Promise<void>;
}

interface AppChildAPI {
  openChilWindow: (path: string) => Promise<void>;
  getAppChildConfig: (path: string) => Promise<Nullable<Record<string, number>>>;
  setAppChildConfig: (path: string, data?: Record<string, number>) => Promise<void>;
  childDevtoolsStatusChanged: (callback: (event: IpcRendererEvent, args: any) => void) => IpcRenderer;
  openChildDevTools: (path: string) => Promise<void>;
  closeChildDevTools: (path: string) => Promise<void>;
  closeChild: (path: string) => Promise<void>;
}

interface StorageAPI {
  getStorage: () => Promise<any>;
  setStorage: (data: any) => Promise<any>;
  updateStorage: () => Promise<any>;
  storageChanged: (callback: (event: IpcRendererEvent, args: boolean) => void) => IpcRenderer;
  getSession: () => Promise<any>;
  setSession: (data: any) => Promise<any>;
  updateSession: () => Promise<any>;
  sessionChanged: (callback: (event: IpcRendererEvent, args: boolean) => void) => IpcRenderer;
}

interface BluetoothAPI {
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
