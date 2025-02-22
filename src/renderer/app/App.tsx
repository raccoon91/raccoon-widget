import { Box } from "@chakra-ui/react";

import { BluetoothPanel } from "@app/components/bluetooth/bluetooth-panel";

export const App = () => {
  return (
    <Box overflow="hidden" w="100wh" h="100vh" p="36px 48px">
      <BluetoothPanel />
    </Box>
  );
};
