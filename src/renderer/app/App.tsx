import { Box } from "@chakra-ui/react";

import { BluetoothPannel } from "@app/components/bluetooth/bluetooth-pannel";

export const App = () => {
  return (
    <Box overflow="hidden" position="relative" w="100wh" h="100vh">
      <BluetoothPannel />
    </Box>
  );
};
