import koffi from "koffi";

import { DWMWA_EXCLUDED_FROM_PEEK, GWLP_HWNDPARENT, HWND_BOTTOM, SWP_NOMOVE, SWP_NOSIZE } from "@/constants/windows";
import { getWindowBuffer, Win } from "@/main/helper/utils";

const isWindows = process.platform === "win32";

const user32 = isWindows ? koffi.load("user32.dll") : null;
const dwmapi = isWindows ? koffi.load("dwmapi.dll") : null;

const FindWindowExA = user32?.func("__stdcall", "FindWindowExA", "ulong", ["ulong", "ulong", "string", "ulong"]);
const GetDesktopWindow = user32?.func("__stdcall", "GetDesktopWindow", "ulong", []);
const SetWindowLongPtrA = user32?.func("__stdcall", "SetWindowLongPtrA", "ulong", ["int", "int", "int"]);
const SetWindowPos = user32?.func("__stdcall", "SetWindowPos", "bool", [
  "ulong",
  "ulong",
  "int",
  "int",
  "int",
  "int",
  "uint",
]);

const DwmSetWindowAttribute = dwmapi?.func("__stdcall", "DwmSetWindowAttribute", "ulong", [
  "long",
  "ulong",
  "bool*",
  "ulong",
]);

export function getDesktopWindow() {
  return GetDesktopWindow?.() as number;
}

export function getSHELLDLL_DefViewHandle() {
  const progman = FindWindowExA?.(0, 0, "Progman", 0) as number;
  let defView = FindWindowExA?.(progman, 0, "SHELLDLL_DefView", 0);

  if (!defView) {
    const desktopHWnd = GetDesktopWindow?.() as number;
    let workerW = 0;
    do {
      workerW = FindWindowExA?.(desktopHWnd, workerW, "WorkerW", 0) as any;
      defView = FindWindowExA?.(workerW, 0, "SHELLDLL_DefView", 0);
    } while (!defView && workerW);
  }

  if (!defView) throw new Error("Not found SHELLDLL_DefView window handle.");

  return defView as number;
}

export function setOwnerWindow(win: Win, target: Win | number) {
  if (!SetWindowLongPtrA) return false;

  const winBuffer = getWindowBuffer(win);
  const targetWnd = getWindowBuffer(target);

  SetWindowLongPtrA(winBuffer, GWLP_HWNDPARENT, targetWnd);

  return true;
}

export function preventFromAeroPeek(win: Win) {
  if (!DwmSetWindowAttribute) return false;

  const winBuffer = getWindowBuffer(win);
  const boolBuffer = koffi.alloc("bool", 1);

  DwmSetWindowAttribute(winBuffer, DWMWA_EXCLUDED_FROM_PEEK, boolBuffer, koffi.sizeof(koffi.types.int32));

  return true;
}

export function zOrderToBottom(win: Win) {
  if (!SetWindowPos) return false;

  const winBuffer = getWindowBuffer(win);

  SetWindowPos(winBuffer, HWND_BOTTOM, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE);

  return true;
}
