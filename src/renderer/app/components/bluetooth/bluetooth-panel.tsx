import { Button, Center, Flex, HStack, Stack, Text } from "@chakra-ui/react";

import { useAppStore } from "@app/stores/app.store";
import { useSavedStore } from "@app/stores/saved.store";
import { useSessionStore } from "@app/stores/session.store";
import { BluetoothCard } from "./bluetooth-card";

export const BluetoothPanel = () => {
  const mode = useAppStore((state) => state.mode);
  const bluetooth = useSavedStore((state) => state.bluetooth);
  const bluetoothInfoMap = useSessionStore((state) => state.bluetoothInfoMap);

  const handleOpenBluetoothWindow = () => {
    window.mainAppAPI.openBluetoothApp();
  };

  return (
    <Stack gap="16px" minW="240px" p="24px" bg="bg.panel" rounded="xl">
      <HStack justify="space-between" h="24px">
        <Text fontSize="16px" fontWeight="bold">
          Bluetooth
        </Text>

        {mode === "setting" ? (
          <Button variant="subtle" size="2xs" onClick={handleOpenBluetoothWindow}>
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
          <Button size="xs" onClick={handleOpenBluetoothWindow}>
            Add Device
          </Button>
        </Center>
      )}
    </Stack>
  );
};
