type Nullish<T> = T | null | undefined;

type Nullable<T> = T | null;

interface PreloadAPI {
  getDeviceByClass: (className: string) => Promise<Nullish<string>>;
  getDevicePropertyById: (instanceId: string) => Promise<Nullish<string>>;
  getSystemByContainerId: (containerId: string | string[]) => Promise<Nullish<string>>;
  getSystemPropertyById: (containerId: string | string[]) => Promise<Nullish<string>>;
  getSystemPropertyByContainerId: (containerId: string) => Promise<Nullish<string>>;
}

interface Window {
  electron: ElectronAPI;
  api: PreloadAPI;
}
