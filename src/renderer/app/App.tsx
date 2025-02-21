import { Box } from "@chakra-ui/react";

import { DevicePannel } from "./components/device-pannel";

export const App = () => {
  return (
    <Box overflow="hidden" position="relative" w="100wh" h="100vh">
      <DevicePannel />
    </Box>
  );
};
