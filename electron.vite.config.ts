import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

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
    plugins: [
      react(),
      TanStackRouterVite({
        target: "react",
        routesDirectory: "./src/renderer/app/routes",
        generatedRouteTree: "./src/renderer/app/routeTree.gen.ts",
      }),
    ],
    resolve: {
      alias: [
        { find: "@", replacement: resolve(__dirname, "src") },
        { find: "@resources", replacement: resolve(__dirname, "resources") },
        { find: "@app", replacement: resolve(__dirname, "src/renderer/app") },
      ],
    },
  },
});
