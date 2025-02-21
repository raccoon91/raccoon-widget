import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { Button, Center, Flex, Heading, HStack, Stack, Text } from "@chakra-ui/react";

import { useBluetoothStore } from "../stores/bluetooth.store";
import { useSystemStore } from "../stores/system.store";
import { DeviceModal } from "./device-modal";
import { DeviceCard } from "./device-card";

export const DevicePannel = () => {
  const [isOpenDeviceModal, setIsOpenDeviceModal] = useState(false);
  const { bluetooth, bluetoothInfoMap, pullDeviceInfo } = useBluetoothStore(
    useShallow((state) => ({
      bluetooth: state.bluetooth,
      bluetoothInfoMap: state.bluetoothInfoMap,
      pullDeviceInfo: state.pullDeviceInfo,
    })),
  );
  const getDeviceByClass = useSystemStore((state) => state.getDeviceByClass);

  useEffect(() => {
    getDeviceByClass("Bluetooth");
  }, []);

  useEffect(() => {
    pullDeviceInfo();
  }, []);

  const handleOpenDeviceModal = () => {
    setIsOpenDeviceModal(true);
  };

  const handleCloseDeviceModal = () => {
    setIsOpenDeviceModal(false);
  };

  return (
    <>
      <Stack w="full" h="full" gap="32px" p="64px 32px ">
        <HStack justify="space-between">
          <Heading>Bluetooth</Heading>
          <Button onClick={handleOpenDeviceModal}>Add</Button>
        </HStack>

        {bluetooth.length ? (
          <Flex gap="12px">
            {bluetooth.map((data, index) => (
              <DeviceCard
                key={index}
                device={data.device}
                system={data.system}
                info={bluetoothInfoMap?.[data.device.InstanceId]}
              />
            ))}
          </Flex>
        ) : (
          <Center flexDirection="column" gap="16px" py="32px">
            <Text>No Devices</Text>

            <Button onClick={handleOpenDeviceModal}>Add Device</Button>
          </Center>
        )}
      </Stack>

      <DeviceModal isOpen={isOpenDeviceModal} onClose={handleCloseDeviceModal} />
    </>
  );
};
