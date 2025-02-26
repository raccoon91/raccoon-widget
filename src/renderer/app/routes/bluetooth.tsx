import { useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";
import { Box, Button, Center, Flex, HStack, Stack } from "@chakra-ui/react";
import { LuX } from "react-icons/lu";
import { BsTerminal, BsTerminalX } from "react-icons/bs";

import { useLocalStore } from "@app/stores/local.store";
import { useAppStore } from "@app/stores/app.store";
import { useBluetoothStore } from "@app/stores/bluetooth.store";
import { BluetoothDeviceSection } from "@app/components/bluetooth/bluetooth-device-section";
import { BluetoothInfoSection } from "@app/components/bluetooth/bluetooth-info-section";

export const BlueToothRoute = () => {
  const addDevice = useLocalStore((state) => state.addDevice);
  const { isChildDevToolsOpenMap, initChildAppInfo, openChildDevTools, closeChildDevTools, closeChild } = useAppStore(
    useShallow((state) => ({
      isChildDevToolsOpenMap: state.isChildDevToolsOpenMap,
      initChildAppInfo: state.initChildAppInfo,
      openChildDevTools: state.openChildDevTools,
      closeChildDevTools: state.closeChildDevTools,
      closeChild: state.closeChild,
    })),
  );
  const { selectedDevice, selectedSystem, clearDeviceState, pullDeviceInfo } = useBluetoothStore(
    useShallow((state) => ({
      selectedDevice: state.selectedDevice,
      selectedSystem: state.selectedSystem,
      systemProperties: state.systemProperties,
      clearDeviceState: state.clearDeviceState,
      pullDeviceInfo: state.pullDeviceInfo,
    })),
  );

  const isChildDevToolsOpen = useMemo(() => isChildDevToolsOpenMap?.["/bluetooth"], [isChildDevToolsOpenMap]);

  useEffect(() => {
    initChildAppInfo("/bluetooth");
  }, []);

  const handleClickOpenChildDevTools = () => {
    openChildDevTools("/bluetooth");
  };

  const handleClickCloseChildDevTools = () => {
    closeChildDevTools("/bluetooth");
  };

  const handleCloseDialog = () => {
    closeChild("/bluetooth");
  };

  const handleAddDevice = () => {
    addDevice(selectedDevice, selectedSystem);

    handleCloseDialog();
    clearDeviceState();

    pullDeviceInfo();
  };

  return (
    <Flex w="vw" h="vh" flexDirection="column" backgroundColor="blackAlpha.700">
      <Flex align="stretch" justify="end" gap="0" h="36px">
        <Box flex="1" css={{ WebkitAppRegion: "drag" }} bg="bg.subtle"></Box>
        {isChildDevToolsOpen ? (
          <Center
            px="12px"
            color="fg.subtle"
            _hover={{ bg: "bg.emphasized", cursor: "pointer" }}
            onClick={handleClickCloseChildDevTools}
          >
            <BsTerminalX size={20} />
          </Center>
        ) : (
          <Center
            px="12px"
            color="fg.subtle"
            _hover={{ bg: "bg.emphasized", cursor: "pointer" }}
            onClick={handleClickOpenChildDevTools}
          >
            <BsTerminal size={20} />
          </Center>
        )}
        <Center
          bg="bg.emphasized"
          px="12px"
          _hover={{ bg: "bg.warning", cursor: "pointer" }}
          onClick={handleCloseDialog}
        >
          <LuX size={20} />
        </Center>
      </Flex>

      <Stack overflow="auto" flex="1" position="relative" gap="12px" p="24px">
        <BluetoothDeviceSection />

        <BluetoothInfoSection />
      </Stack>

      <HStack justify="end" p="8px 24px" borderTop="1px solid" borderColor="fg.muted">
        <Button size="xs" variant="ghost" mr={3} onClick={handleCloseDialog}>
          Close
        </Button>
        <Button size="xs" disabled={!selectedDevice || !selectedSystem} onClick={handleAddDevice}>
          Add
        </Button>
      </HStack>
    </Flex>
  );
};

export const Route = createFileRoute("/bluetooth")({
  component: BlueToothRoute,
});
