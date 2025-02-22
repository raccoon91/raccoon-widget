import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: [
        { find: "@", replacement: resolve(__dirname, "src") },
        { find: "@resources", replacement: resolve(__dirname, "resources") },
        { find: "@app", replacement: resolve(__dirname, "src/renderer/app") },
      ],
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: [
        { find: "@", replacement: resolve(__dirname, "src") },
        { find: "@resources", replacement: resolve(__dirname, "resources") },
        { find: "@app", replacement: resolve(__dirname, "src/renderer/app") },
      ],
    },
  },
  renderer: {
    plugins: [react()],
    resolve: {
      alias: [
        { find: "@", replacement: resolve(__dirname, "src") },
        { find: "@resources", replacement: resolve(__dirname, "resources") },
        { find: "@app", replacement: resolve(__dirname, "src/renderer/app") },
      ],
    },
  },
});
