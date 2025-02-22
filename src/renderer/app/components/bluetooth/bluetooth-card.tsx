import { FC, useEffect } from "react";
import { Card, HStack, Text, Box } from "@chakra-ui/react";

import { useBluetoothStore } from "@app/stores/bluetooth.store";

interface BluetoothCardProps {
  deviceInstanceId: string;
  deviceName: string;
  info?: Record<string, Record<string, string>>;
}

export const BluetoothCard: FC<BluetoothCardProps> = ({ deviceInstanceId, deviceName, info }) => {
  const pullSystemInfo = useBluetoothStore((state) => state.pullSystemInfo);

  useEffect(() => {
    if (info?.device?.connected === "true") {
      // pullSystemInfo(deviceInstanceId);
    }
  }, [deviceInstanceId, info?.device?.connected]);

  return (
    <Card.Root minW="160px" gap="8px" p="16px 24px">
      <Box position="relative" pr="16px">
        <Card.Header p="0" fontWeight="semibold">
          {deviceName}
        </Card.Header>

        {info?.device?.connected === "true" ? (
          <Box position="absolute" top="8px" right="0px" w="10px" h="10px" rounded="md" bg="green.400" />
        ) : null}
      </Box>

      <Card.Body p="0">
        {info?.device?.connected === "true" ? (
          <HStack justify="end">
            <Text fontSize="14px">Battery</Text>
            <Text fontSize="14px">{info?.system?.battery_level ? `${info?.system?.battery_level}%` : "-"}</Text>
          </HStack>
        ) : (
          <Text color="fg.subtle" textAlign="right" fontSize="14px">
            Unconnected
          </Text>
        )}
      </Card.Body>
    </Card.Root>
  );
};
