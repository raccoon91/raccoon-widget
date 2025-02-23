import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { Button, Center, Flex, HStack, Stack, Text } from "@chakra-ui/react";

import { useAppStore } from "@app/stores/app.store";
import { useSystemStore } from "@app/stores/system.store";
import { useBluetoothStore } from "@app/stores/bluetooth.store";
import { useInterval } from "@app/hooks/useInterval";
import { BluetoothDialog } from "./bluetooth-dialog";
import { BluetoothCard } from "./bluetooth-card";

export const BluetoothPanel = () => {
  const mode = useAppStore((state) => state.mode);
  const getDeviceByClass = useSystemStore((state) => state.getDeviceByClass);
  const { bluetooth, bluetoothInfoMap, pullDeviceInfo } = useBluetoothStore(
    useShallow((state) => ({
      bluetooth: state.bluetooth,
      bluetoothInfoMap: state.bluetoothInfoMap,
      pullDeviceInfo: state.pullDeviceInfo,
    })),
  );
  const [isOpenBluetoothDialog, setIsOpenBluetoothDialog] = useState(false);

  useInterval(() => {
    pullDeviceInfo();
  });

  useEffect(() => {
    pullDeviceInfo();
  }, []);

  useEffect(() => {
    getDeviceByClass("Bluetooth");
  }, []);

  const handleOpenBluetoothDialog = () => {
    setIsOpenBluetoothDialog(true);
  };

  return (
    <>
      <Stack gap="16px" p="24px" bg="bg.panel" rounded="xl">
        <HStack justify="space-between" h="24px">
          <Text fontSize="16px" fontWeight="bold">
            Bluetooth
          </Text>

          {mode === "setting" ? (
            <Button variant="subtle" size="2xs" onClick={handleOpenBluetoothDialog}>
              Add
            </Button>
          ) : null}
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
          <Center flexDirection="column" gap="8px" py="24px">
            <Text fontSize="14px">No Devices</Text>
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
