"use client";

import { ChakraProvider, createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

const customConfig = defineConfig({
  globalCss: {
    html: {
      backgroundColor: "transparent",
    },
    "::-webkit-scrollbar": {
      width: "8px",
    },
    "::-webkit-scrollbar-thumb": {
      background: "bg.emphasized",
      rounded: "sm",
    },
  },
});

const system = createSystem(defaultConfig, customConfig);

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
