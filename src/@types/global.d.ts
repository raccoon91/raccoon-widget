type Nullish<T> = T | null | undefined;

type Nullable<T> = T | null;

interface Window {
  electron: ElectronAPI;
  appAPI: AppAPI;
  appChildAPI: AppChildAPI;
  storageAPI: StorageAPI;
  bluetoothAPI: BluetoothAPI;
  widgetAPI: WidgetAPI;
}
