type Nullish<T> = T | null | undefined;

type Nullable<T> = T | null;

type App = {
  name: string;
  window: BrowserWindow;
};

interface Window {
  electron: ElectronAPI;
  mainAppAPI: AppAPI & MainAppAPI;
  bluetoothAppAPI: AppAPI;
  mainStorageAPI: StorageAPI;
  bluetoothStorageAPI: StorageAPI;
  shellAPI: ShellAPI;
  widgetAPI: WidgetAPI;
}
