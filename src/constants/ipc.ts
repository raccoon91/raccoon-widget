// app
export const GET_APP_CONFIG = "get-app-config";

export const SET_APP_CONFIG = "set-app-config";

export const MINIMIZE_WINDOW = "minimize-window";

export const MAXIMIZE_WINDOW = "maximize-window";

export const DEVTOOLS_STATUS_CHAGEND = "devtools-status-changed";

export const OPEN_DEV_TOOLS = "open-dev-tools";

export const CLOSE_DEV_TOOLS = "close-dev-tools";

export const CLOSE_WINDOW = "close-window";

// app-child
export const OPEN_APP_CHILD_WINDOW = "open-app-child-window";

export const GET_APP_CHILD_CONFIG = "get-app-child-config";

export const SET_APP_CHILD_CONFIG = "set-app-child-config";

export const APP_CHILD_DEVTOOLS_STATUS_CHAGEND = "app-child-devtools-status-changed";

export const OPEN_APP_CHILD_DEV_TOOLS = "open-app-child-dev-tools";

export const CLOSE_APP_CHILD_DEV_TOOLS = "close-app-child-dev-tools";

export const CLOSE_APP_CHILD_WINDOW = "close-app-child-window";

// bluetooth
export const GET_DEVICE_BY_CLASS = "get-device-by-class";

export const GET_DEVICE_PROPERTY_BY_ID = "get-device-property-by-id";

export const GET_SYSTEM_BY_CONTAINER_ID = "get-system-by-container-id";

export const GET_SYSTEM_PROPERTY_BY_ID = "get-system-property-by-id";

export const GET_SYSTEM_PROPERTY_BY_CONTAINER_ID = "get-system-property-by-container-id";

// storage
export const GET_STORAGE = "get-storage";

export const SET_STORAGE = "set-storage";

export const STORAGE_CHANGED = "storage-changed";

export const UPDATE_STORAGE = "update-storage";

export const GET_SESSION = "get-session";

export const SET_SESSION = "set-session";

export const SESSION_CHANGED = "session-changed";

export const UPDATE_SESSION = "update-session";

// widget
export const PREVENT_FROM_AERO_PEEK = "prevent-from-aero-peek";

export const PREVENT_FROM_SHOW_DESKTOP = "prevent-from-show-desktop";

export const CANCEL_PREVENT_FROM_SHOW_DESKTOP = "cancel-prevent-from-show-desktop";

export const MOVE_TO_BOTTOM = "move-to-bottom";

export const ALWAYS_TO_BOTTOM = "always-on-bottom";

export const CANCEL_ALWAYS_TO_BOTTOM = "cancel-always-on-bottom";

export const APP_IPC = {
  GET_APP_CONFIG,
  SET_APP_CONFIG,
  MINIMIZE_WINDOW,
  MAXIMIZE_WINDOW,
  DEVTOOLS_STATUS_CHAGEND,
  OPEN_DEV_TOOLS,
  CLOSE_DEV_TOOLS,
  CLOSE_WINDOW,
};

export const APP_CHILD_IPC = {
  OPEN_APP_CHILD_WINDOW,
  GET_APP_CHILD_CONFIG,
  SET_APP_CHILD_CONFIG,
  APP_CHILD_DEVTOOLS_STATUS_CHAGEND,
  OPEN_APP_CHILD_DEV_TOOLS,
  CLOSE_APP_CHILD_DEV_TOOLS,
  CLOSE_APP_CHILD_WINDOW,
};

export const STORAGE_IPC = {
  GET_STORAGE,
  SET_STORAGE,
  STORAGE_CHANGED,
  UPDATE_STORAGE,
  GET_SESSION,
  SET_SESSION,
  SESSION_CHANGED,
  UPDATE_SESSION,
};

export const BLUETOOTH_IPC = {
  GET_DEVICE_BY_CLASS,
  GET_DEVICE_PROPERTY_BY_ID,
  GET_SYSTEM_BY_CONTAINER_ID,
  GET_SYSTEM_PROPERTY_BY_ID,
  GET_SYSTEM_PROPERTY_BY_CONTAINER_ID,
};

export const WIDGET_IPC = {
  PREVENT_FROM_AERO_PEEK,
  PREVENT_FROM_SHOW_DESKTOP,
  CANCEL_PREVENT_FROM_SHOW_DESKTOP,
  MOVE_TO_BOTTOM,
  ALWAYS_TO_BOTTOM,
  CANCEL_ALWAYS_TO_BOTTOM,
};
