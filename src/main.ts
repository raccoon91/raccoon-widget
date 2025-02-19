import path from "node:path";
import { execSync } from "child_process";
import { app, BrowserWindow, ipcMain } from "electron";
import started from "electron-squirrel-startup";

// BTHENUM\{0000111E-0000-1000-8000-00805F9B34FB}_VID&00010075_PID&A013\7&3B1D614A&0&DCCCE61F7DB1_C00000000
// powershell -Command "Get-PnpDevice | Get-PnpDeviceProperty -KeyName '{104EA319-6EE2-4701-BD47-8DDBF425BBE5} 2' | Where-Object { $_.Type -eq 'Byte' } | Select-Object InstanceId"
// powershell -Command "Get-PnpDevice -InstanceId 'BTHENUM\\{0000111E-0000-1000-8000-00805F9B34FB}_VID&00010075_PID&A013\\7&3B1D614A&0&DCCCE61F7DB1_C00000000'"
// powershell -Command "Get-PnpDevice -FriendlyName 'WH-1000XM4 Hands-Free AG' | Select-Object InstanceId"
// powershell -Command "Get-PnpDevice -FriendlyName 'WH-1000XM4 Hands-Free AG' | Get-PnpDeviceProperty"
// powershell -Command "Get-PnpDevice -Class System | Get-PnpDeviceProperty | Where-Object { $_.KeyName -eq 'DEVPKEY_Device_ContainerId' -and $_.Data -eq '{DB2FC1F5-91D7-5A4B-A68A-9DA34E4E7A17}' }
// powershell -Command "Get-PnpDeviceProperty -InstanceId (Get-PnpDevice -Class System | Where-Object { (Get-PnpDeviceProperty -InstanceId $_.InstanceId | Where-Object { $_.KeyName -eq 'DEVPKEY_Device_ContainerId' }).Data -eq '{DB2FC1F5-91D7-5A4B-A68A-9DA34E4E7A17}' }).InstanceId"

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.handle("get-paired-bluetooth", () => {
    try {
      const stdout = execSync(
        'powershell -Command "[System.Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Get-PnpDevice -Class Bluetooth | Select-Object FriendlyName"',
      );

      const enc = new TextDecoder("utf-8");
      const arr = new Uint8Array(stdout);
      const str = enc.decode(arr);

      const result = str
        .trim()
        .split("\n")
        .slice(2)
        .map((text) => text.trim());

      return result;
    } catch (error) {
      console.error(error);
    }
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
