import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { Button, Center, Flex, Heading, HStack, Stack, Text } from "@chakra-ui/react";

import { useBluetoothStore } from "@app/stores/bluetooth.store";
import { useSystemStore } from "@app/stores/system.store";
import { BluetoothDialog } from "./bluetooth-dialog";
import { BluetoothCard } from "./bluetooth-card";

export const BluetoothPanel = () => {
  const [isOpenBluetoothDialog, setIsOpenBluetoothDialog] = useState(false);
  const { bluetooth, bluetoothInfoMap, pullDeviceInfo } = useBluetoothStore(
    useShallow((state) => ({
      bluetooth: state.bluetooth,
      bluetoothInfoMap: state.bluetoothInfoMap,
      pullDeviceInfo: state.pullDeviceInfo,
    })),
  );
  const getDeviceByClass = useSystemStore((state) => state.getDeviceByClass);

  useEffect(() => {
    // pullDeviceInfo();
  }, []);

  useEffect(() => {
    // getDeviceByClass("Bluetooth");
  }, []);

  const handleOpenBluetoothDialog = () => {
    setIsOpenBluetoothDialog(true);
  };

  return (
    <>
      <Stack gap="24px" p="24px" bg="bg.panel" rounded="xl">
        <HStack justify="space-between">
          <Heading fontSize="24px">Bluetooth</Heading>
          <Button variant="subtle" size="xs" onClick={handleOpenBluetoothDialog}>
            Add
          </Button>
        </HStack>

        {bluetooth.length ? (
          <Flex wrap="wrap" gap="12px">
            {bluetooth.map((data, index) => (
              <BluetoothCard
                key={index}
                deviceInstanceId={data.device.InstanceId}
                deviceName={data.device.FriendlyName}
                info={bluetoothInfoMap?.[data.device.InstanceId]}
              />
            ))}
          </Flex>
        ) : (
          <Center flexDirection="column" gap="12px" py="24px">
            <Text>No Devices</Text>
            <Button size="xs" onClick={handleOpenBluetoothDialog}>
              Add Device
            </Button>
          </Center>
        )}
      </Stack>

      <BluetoothDialog open={isOpenBluetoothDialog} setOpen={setIsOpenBluetoothDialog} />
    </>
  );
};
