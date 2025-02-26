import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { Button, Center, Flex, HStack, Stack, Text } from "@chakra-ui/react";

import { useLocalStore } from "@app/stores/local.store";
import { useAppStore } from "@app/stores/app.store";
import { useBluetoothStore } from "@app/stores/bluetooth.store";
import { useInterval } from "@app/hooks/useInterval";
import { BluetoothCard } from "./bluetooth-card";

export const BluetoothPanel = () => {
  const mode = useAppStore((state) => state.mode);
  const bluetooth = useLocalStore((state) => state.bluetooth);
  const { bluetoothInfoMap, pullDeviceInfo } = useBluetoothStore(
    useShallow((state) => ({
      bluetoothInfoMap: state.bluetoothInfoMap,
      pullDeviceInfo: state.pullDeviceInfo,
    })),
  );

  useInterval(() => {
    pullDeviceInfo();
  });

  useEffect(() => {
    pullDeviceInfo();
  }, []);

  const handleOpenBluetoothDialog = () => {
    window.open("/bluetooth");
  };

  return (
    <>
      <Stack gap="16px" minW="240px" p="24px" bg="bg.panel" rounded="xl">
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
          <Center flexDirection="column" gap="12px" py="24px">
            <Text fontSize="14px">No Devices</Text>
            <Button size="xs" onClick={handleOpenBluetoothDialog}>
              Add Device
            </Button>
          </Center>
        )}
      </Stack>

      {/* <BluetoothDialog open={isOpenBluetoothDialog} setOpen={setIsOpenBluetoothDialog} /> */}
    </>
  );
};
