import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";

import { App } from "./App";
import { theme } from "./styles/theme";

const root = createRoot(document.body);

root.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>,
);
