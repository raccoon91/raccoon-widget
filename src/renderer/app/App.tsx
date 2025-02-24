import { Box, Center, Flex } from "@chakra-ui/react";
import { useShallow } from "zustand/shallow";
import { IoSettingsOutline } from "react-icons/io5";
import { LuMonitor, LuX } from "react-icons/lu";

import { useAppStore } from "@app/stores/app.store";
import { BluetoothPanel } from "@app/components/bluetooth/bluetooth-panel";
import { useEffect } from "react";
import { BsTerminal, BsTerminalX } from "react-icons/bs";

export const App = () => {
  const {
    mode,
    isDevToolsOpen,
    initAppInfo,
    openDevTools,
    closeDevTools,
    changeToDisplayMode,
    changeToSettingMode,
    close,
  } = useAppStore(
    useShallow((state) => ({
      mode: state.mode,
      isDevToolsOpen: state.isDevToolsOpen,
      initAppInfo: state.initAppInfo,
      openDevTools: state.openDevTools,
      closeDevTools: state.closeDevTools,
      changeToDisplayMode: state.changeToDisplayMode,
      changeToSettingMode: state.changeToSettingMode,
      close: state.close,
    })),
  );

  useEffect(() => {
    initAppInfo();
  }, []);

  const handleClickOpenDevTools = () => {
    openDevTools();
  };

  const handleClickCloseDevTools = () => {
    closeDevTools();
  };

  const handleClickSettingMode = () => {
    changeToSettingMode();
  };

  const handleClickDisplayMode = () => {
    changeToDisplayMode(window.innerWidth, window.innerHeight, window.screenX, window.screenY);
  };

  const handleClickCloseApp = () => {
    close();
  };

  return (
    <Box overflow="hidden" w="vw" h="vh" backgroundColor={mode === "setting" ? "blackAlpha.700" : "transparent"}>
      <Flex align="stretch" justify="end" gap="0" h="36px">
        {mode === "setting" ? (
          <>
            <Box flex="1" css={{ WebkitAppRegion: "drag" }} bg="bg.subtle"></Box>
            {isDevToolsOpen ? (
              <Center
                px="12px"
                color="fg.subtle"
                _hover={{ bg: "bg.emphasized", cursor: "pointer" }}
                onClick={handleClickCloseDevTools}
              >
                <BsTerminalX size={20} />
              </Center>
            ) : (
              <Center
                px="12px"
                color="fg.subtle"
                _hover={{ bg: "bg.emphasized", cursor: "pointer" }}
                onClick={handleClickOpenDevTools}
              >
                <BsTerminal size={20} />
              </Center>
            )}
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
          </>
        ) : (
          <>
            <Center
              px="12px"
              color="fg.subtle"
              _hover={{ bg: "bg.emphasized", cursor: "pointer" }}
              onClick={handleClickSettingMode}
            >
              <IoSettingsOutline size={20} />
            </Center>
            <Box w="44px" />
          </>
        )}
      </Flex>

      <Box p="16px 32px">
        <BluetoothPanel />
      </Box>
    </Box>
  );
};
