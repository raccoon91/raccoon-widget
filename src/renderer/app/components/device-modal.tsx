import { FC, MouseEvent, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Stack,
  Text,
  Center,
  Spinner,
  HStack,
  Box,
  Divider,
} from "@chakra-ui/react";
import { useShallow } from "zustand/shallow";

import { PROPERTY_MAP } from "../constants/system.constant";
import { useSystemStore } from "../stores/system.store";
import { useBluetoothStore } from "../stores/bluetooth.store";

interface DeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeviceModal: FC<DeviceModalProps> = ({ isOpen, onClose }) => {
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

  const handleReloadDevice = () => {
    getDeviceByClass("Bluetooth");
  };

  const handleClickBluetooth = async (e: MouseEvent<HTMLButtonElement>) => {
    const instanceId = e.currentTarget.dataset["instanceId"];

    getDevicePropertyById(instanceId);
  };

  const handleAddDevice = () => {
    addDevice(selectedDevice, selectedSystem);

    onClose();
    clearState();
  };

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody as={Stack} gap="16px" p="24px 24px 0">
          <Stack gap="8px">
            <HStack justify="space-between">
              <HStack gap="8px">
                <Text fontSize="xl" fontWeight="semibold">
                  Bluetooth Device
                </Text>

                <Button size="xs" onClick={handleReloadDevice}>
                  Reload
                </Button>
              </HStack>

              <ModalCloseButton position="unset" top="unset" left="unset" />
            </HStack>

            <Box
              position="relative"
              overflowY={loadingDevice ? "hidden" : "auto"}
              h="240px"
              bg="blackAlpha.300"
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
                  <Text flex="1" noOfLines={1}>
                    {device.FriendlyName}
                  </Text>

                  <Button data-instance-id={device.InstanceId} size="xs" onClick={handleClickBluetooth}>
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
              bg="blackAlpha.300"
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
                        <Text flex="1" noOfLines={1}>
                          {property.Data.toString()}
                        </Text>
                      </HStack>
                    ))
                  ) : (
                    <Text p="4px 12px" fontSize="14px">
                      No Device Property
                    </Text>
                  )}

                  <Divider my="4px" />

                  <Text p="4px 12px">System</Text>

                  {selectedSystem ? (
                    <HStack gap="16px" p="4px 12px">
                      <Text w="160px">system instance id</Text>
                      <Text flex="1" noOfLines={1}>
                        {selectedDevice.InstanceId}
                      </Text>
                    </HStack>
                  ) : (
                    <Text p="4px 12px" fontSize="14px">
                      No System
                    </Text>
                  )}

                  <Divider my="4px" />

                  <Text p="4px 12px">System Property</Text>

                  {systemProperties.length ? (
                    systemProperties.map((property, index) => (
                      <HStack key={index} gap="16px" p="4px 12px">
                        <Text w="160px">{PROPERTY_MAP[property.KeyName].name}</Text>
                        <Text flex="1" noOfLines={1}>
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
        </ModalBody>

        <ModalFooter>
          <Button size="sm" variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button size="sm" isDisabled={!selectedDevice || !selectedSystem} onClick={handleAddDevice}>
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
