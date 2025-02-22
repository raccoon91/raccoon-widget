import { FC, useEffect } from "react";
import { Card, CardHeader, CardBody, HStack, Text, Box } from "@chakra-ui/react";

import { useBluetoothStore } from "@app/stores/bluetooth.store";

interface DeviceCardProps {
  deviceInstanceId: string;
  deviceName: string;
  info?: Record<string, Record<string, string>>;
}

export const DeviceCard: FC<DeviceCardProps> = ({ deviceInstanceId, deviceName, info }) => {
  const pullSystemInfo = useBluetoothStore((state) => state.pullSystemInfo);

  useEffect(() => {
    if (info?.device?.connected === "true") {
      // pullSystemInfo(deviceInstanceId);
    }
  }, [deviceInstanceId, info?.device?.connected]);

  return (
    <Card p="16px 24px" minW="160px" boxShadow="md">
      <Box position="relative" pr="24px">
        <CardHeader p="0" fontWeight="semibold">
          {deviceName}
        </CardHeader>

        {info?.device?.connected === "true" ? (
          <Box position="absolute" top="8px" right="0px" w="10px" h="10px" rounded="md" bg="green.400" />
        ) : null}
      </Box>

      <CardBody mt="8px" p="0">
        {info?.device?.connected === "true" ? (
          <HStack justify="end">
            <Text fontSize="14px">Battery</Text>
            <Text fontSize="14px">{info?.system?.battery_level ? `${info?.system?.battery_level}%` : "-"}</Text>
          </HStack>
        ) : (
          <Text textAlign="right" fontSize="14px">
            Unconnected
          </Text>
        )}
      </CardBody>
    </Card>
  );
};
