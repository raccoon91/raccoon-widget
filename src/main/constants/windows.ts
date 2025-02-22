import koffi from "koffi";

export const SWP_NOZORDER = 4;
export const SWP_NOMOVE = 2;
export const SWP_NOSIZE = 1;

export const HWND_BOTTOM = 1;
export const WM_WINDOWPOSCHANGING = 70;

export const DWMWA_EXCLUDED_FROM_PEEK = 12;

export const GWLP_HWNDPARENT = -8;

export const WINDOWPOS = koffi.struct("POINT", {
  hwnd: koffi.types.int32,
  hwndInsertAfter: koffi.types.int32,
  x: koffi.types.int32,
  y: koffi.types.int32,
  cx: koffi.types.int32,
  cy: koffi.types.int32,
  flags: koffi.types.uint32,
});
