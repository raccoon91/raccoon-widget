import { Box, Center, Flex } from "@chakra-ui/react";
import { useShallow } from "zustand/shallow";
import { IoSettingsOutline } from "react-icons/io5";
import { LuMonitor, LuX } from "react-icons/lu";

import { useAppStore } from "@app/stores/app.store";
import { BluetoothPanel } from "@app/components/bluetooth/bluetooth-panel";

export const App = () => {
  const { mode, changeToDisplayMode, changeToSettingMode, close } = useAppStore(
    useShallow((state) => ({
      mode: state.mode,
      changeToDisplayMode: state.changeToDisplayMode,
      changeToSettingMode: state.changeToSettingMode,
      close: state.close,
    })),
  );

  const handleClickSettingMode = () => {
    changeToSettingMode();
  };

  const handleClickDisplayMode = () => {
    changeToDisplayMode();
  };

  const handleClickCloseApp = () => {
    close();
  };

  return (
    <Box overflow="hidden" w="vw" h="vh" backgroundColor={mode === "setting" ? "blackAlpha.700" : "transparent"}>
      {mode === "setting" ? (
        <Flex align="stretch" justify="end" gap="0" h="36px" bg="bg.subtle">
          <Box flex="1" css={{ WebkitAppRegion: "drag" }}></Box>
          <Center
            h="36px"
            px="12px"
            _hover={{ bg: "bg.emphasized", cursor: "pointer" }}
            onClick={handleClickDisplayMode}
          >
            <LuMonitor size={20} />
          </Center>
          <Center
            bg="bg.emphasized"
            px="12px"
            _hover={{ bg: "bg.warning", cursor: "pointer" }}
            onClick={handleClickCloseApp}
          >
            <LuX size={20} />
          </Center>
        </Flex>
      ) : (
        <Flex align="stretch" justify="end" h="36px" pr="44px">
          <Center
            px="12px"
            rounded="md"
            color="fg.subtle"
            _hover={{ bg: "bg.emphasized", cursor: "pointer" }}
            onClick={handleClickSettingMode}
          >
            <IoSettingsOutline size={20} />
          </Center>
        </Flex>
      )}

      <Box p="16px 32px">
        <BluetoothPanel />
      </Box>
    </Box>
  );
};
