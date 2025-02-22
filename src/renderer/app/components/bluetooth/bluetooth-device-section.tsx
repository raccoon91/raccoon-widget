import { MouseEvent } from "react";
import { useShallow } from "zustand/shallow";
import { Box, Button, Center, HStack, IconButton, Spinner, Stack, Text } from "@chakra-ui/react";
import { IoReload } from "react-icons/io5";

import { useSystemStore } from "@app/stores/system.store";

export const BluetoothDeviceSection = () => {
  const { loadingDevice, deviceLoadingMessage, devices, selectedDevice, getDeviceByClass, getDevicePropertyById } =
    useSystemStore(
      useShallow((state) => ({
        loadingDevice: state.loadingDevice,
        deviceLoadingMessage: state.deviceLoadingMessage,
        devices: state.devices,
        selectedDevice: state.selectedDevice,
        getDeviceByClass: state.getDeviceByClass,
        getDevicePropertyById: state.getDevicePropertyById,
      })),
    );

  const handleReloadDevice = () => {
    getDeviceByClass("Bluetooth");
  };

  const handleClickBluetooth = async (e: MouseEvent<HTMLButtonElement>) => {
    const instanceId = e.currentTarget.dataset["instanceId"];

    getDevicePropertyById(instanceId);
  };

  return (
    <Stack gap="12px">
      <HStack gap="16px">
        <Text fontSize="xl" fontWeight="semibold">
          Bluetooth Device
        </Text>

        <IconButton size="2xs" onClick={handleReloadDevice}>
          <IoReload />
        </IconButton>
      </HStack>

      <Box position="relative" overflowY={loadingDevice ? "hidden" : "auto"} h="240px" border="1px solid" rounded="md">
        {loadingDevice ? (
          <Center
            position="absolute"
            top="0"
            left="0"
            flexDirection="column"
            gap="16px"
            w="full"
            h="full"
            bg="blackAlpha.800"
            zIndex="10"
          >
            <Spinner size="xl" borderWidth="4px" />
            <Text>{deviceLoadingMessage}</Text>
          </Center>
        ) : null}

        {devices.length ? (
          devices.map((device) => (
            <HStack
              key={device.InstanceId}
              gap="16px"
              p="6px 12px"
              bg={device.InstanceId === selectedDevice?.InstanceId ? "bg.emphasized" : "unset"}
              _hover={{ bg: "bg" }}
            >
              <Text flex="1" truncate>
                {device.FriendlyName}
              </Text>
              <Button size="2xs" data-instance-id={device.InstanceId} onClick={handleClickBluetooth}>
                Select
              </Button>
            </HStack>
          ))
        ) : (
          <Center w="full" h="full">
            <Button size="xs" onClick={handleReloadDevice}>
              Get Device
            </Button>
          </Center>
        )}
      </Box>
    </Stack>
  );
};
