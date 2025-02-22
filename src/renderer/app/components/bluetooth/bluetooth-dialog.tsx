import { FC, MouseEvent } from "react";
import { useShallow } from "zustand/shallow";

import { PROPERTY_MAP } from "@/constants/system";
import { useSystemStore } from "@app/stores/system.store";
import { useBluetoothStore } from "@app/stores/bluetooth.store";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@app/components/ui/dialog";
import {
  Box,
  Button,
  Center,
  DialogOpenChangeDetails,
  HStack,
  Separator,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";

interface BluetoothDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BluetoothDialog: FC<BluetoothDialogProps> = ({ open, setOpen }) => {
  const {
    loadingDevice,
    loadingProperty,
    deviceLoadingMessage,
    propertyLoadingMessage,
    devices,
    deviceProperties,
    selectedDevice,
    selectedSystem,
    systemProperties,
    clearState,
    getDeviceByClass,
    getDevicePropertyById,
  } = useSystemStore(
    useShallow((state) => ({
      loadingDevice: state.loadingDevice,
      loadingProperty: state.loadingProperty,
      deviceLoadingMessage: state.deviceLoadingMessage,
      propertyLoadingMessage: state.propertyLoadingMessage,
      devices: state.devices,
      deviceProperties: state.deviceProperties,
      selectedDevice: state.selectedDevice,
      selectedSystem: state.selectedSystem,
      systemProperties: state.systemProperties,
      clearState: state.clearState,
      getDeviceByClass: state.getDeviceByClass,
      getDevicePropertyById: state.getDevicePropertyById,
    })),
  );
  const addDevice = useBluetoothStore((state) => state.addDevice);

  const handleChangeOpen = (e: DialogOpenChangeDetails) => {
    setOpen(e.open);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleReloadDevice = () => {
    getDeviceByClass("Bluetooth");
  };

  const handleClickBluetooth = async (e: MouseEvent<HTMLButtonElement>) => {
    const instanceId = e.currentTarget.dataset["instanceId"];

    getDevicePropertyById(instanceId);
  };

  const handleAddDevice = () => {
    addDevice(selectedDevice, selectedSystem);

    handleCloseDialog();
    clearState();
  };

  return (
    <DialogRoot size="md" closeOnEscape open={open} onOpenChange={handleChangeOpen}>
      <DialogContent>
        <DialogHeader as={HStack} justifyContent="space-between" pb="8px">
          <HStack gap="16px">
            <DialogTitle fontSize="xl" fontWeight="semibold">
              Bluetooth Device
            </DialogTitle>

            <Button size="2xs" onClick={handleReloadDevice}>
              Reload
            </Button>
          </HStack>

          <DialogCloseTrigger position="unset" />
        </DialogHeader>

        <DialogBody as={Stack} gap="16px" p="0 24px">
          <Stack gap="8px">
            <Box
              position="relative"
              overflowY={loadingDevice ? "hidden" : "auto"}
              h="240px"
              border="1px solid"
              rounded="md"
            >
              {loadingDevice ? (
                <Center
                  position="absolute"
                  top="0"
                  left="0"
                  flexDirection="column"
                  gap="16px"
                  w="full"
                  h="full"
                  bg="blackAlpha.400"
                  zIndex="10"
                >
                  <Spinner size="lg" />

                  <Text>{deviceLoadingMessage}</Text>
                </Center>
              ) : null}

              {devices.map((device) => (
                <HStack
                  key={device.InstanceId}
                  gap="16px"
                  p="6px 12px"
                  rounded="md"
                  bg={device.InstanceId === selectedDevice?.InstanceId ? "gray.900" : "unset"}
                  _hover={{ bg: "gray.800" }}
                >
                  <Text flex="1" truncate>
                    {device.FriendlyName}
                  </Text>

                  <Button data-instance-id={device.InstanceId} size="2xs" onClick={handleClickBluetooth}>
                    Select
                  </Button>
                </HStack>
              ))}
            </Box>
          </Stack>

          <Stack gap="8px">
            <Text fontSize="xl" fontWeight="semibold">
              Info
            </Text>

            <Box
              position="relative"
              overflowY={loadingDevice ? "hidden" : "auto"}
              h="240px"
              border="1px solid"
              rounded="md"
            >
              {loadingProperty ? (
                <Center
                  position="absolute"
                  top="0"
                  left="0"
                  flexDirection="column"
                  gap="16px"
                  w="full"
                  h="full"
                  bg="blackAlpha.400"
                  zIndex="10"
                >
                  <Spinner size="lg" />

                  <Text>{propertyLoadingMessage}</Text>
                </Center>
              ) : null}

              {selectedDevice ? (
                <>
                  <Text p="4px 12px">Device Property</Text>

                  {deviceProperties.length ? (
                    deviceProperties?.map((property, index) => (
                      <HStack key={index} gap="16px" p="4px 12px">
                        <Text w="160px">{PROPERTY_MAP[property.KeyName].name}</Text>
                        <Text flex="1" truncate>
                          {property.Data.toString()}
                        </Text>
                      </HStack>
                    ))
                  ) : (
                    <Text p="4px 12px" fontSize="14px">
                      No Device Property
                    </Text>
                  )}

                  <Separator my="4px" />

                  <Text p="4px 12px">System</Text>

                  {selectedSystem ? (
                    <HStack gap="16px" p="4px 12px">
                      <Text w="160px">system instance id</Text>
                      <Text flex="1" truncate>
                        {selectedDevice.InstanceId}
                      </Text>
                    </HStack>
                  ) : (
                    <Text p="4px 12px" fontSize="14px">
                      No System
                    </Text>
                  )}

                  <Separator my="4px" />

                  <Text p="4px 12px">System Property</Text>

                  {systemProperties.length ? (
                    systemProperties.map((property, index) => (
                      <HStack key={index} gap="16px" p="4px 12px">
                        <Text w="160px">{PROPERTY_MAP[property.KeyName].name}</Text>
                        <Text flex="1" truncate>
                          {property.Data.toString()}
                        </Text>
                      </HStack>
                    ))
                  ) : (
                    <Text p="4px 12px" fontSize="14px">
                      No System Property
                    </Text>
                  )}
                </>
              ) : (
                <Center flexDirection="column" w="full" h="full">
                  <Text p="4px 12px" fontSize="14px">
                    No Device
                  </Text>

                  <Text p="4px 12px" fontSize="14px">
                    Select Device First
                  </Text>
                </Center>
              )}
            </Box>
          </Stack>
        </DialogBody>

        <DialogFooter>
          <Button size="sm" variant="ghost" mr={3} onClick={handleCloseDialog}>
            Close
          </Button>
          <Button size="sm" disabled={!selectedDevice || !selectedSystem} onClick={handleAddDevice}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
