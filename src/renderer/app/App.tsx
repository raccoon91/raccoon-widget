import { Box, Center, HStack } from "@chakra-ui/react";

import { BluetoothPanel } from "@app/components/bluetooth/bluetooth-panel";
import { LuX } from "react-icons/lu";

export const App = () => {
  const clickHandleClose = () => {
    window.appAPI.close();
  };

  return (
    <Box w="100wh" h="100vh">
      <HStack alignItems="stretch" justifyContent="end" gap="0" h="36px" bg="bg.subtle">
        <Box flex="1" css={{ WebkitAppRegion: "drag" }}></Box>
        <Center
          bg="bg.emphasized"
          px="12px"
          _hover={{ bg: "bg.warning", cursor: "pointer" }}
          onClick={clickHandleClose}
        >
          <LuX size={20} />
        </Center>
      </HStack>

      <Box p="36px 48px">
        <BluetoothPanel />
      </Box>
    </Box>
  );
};
