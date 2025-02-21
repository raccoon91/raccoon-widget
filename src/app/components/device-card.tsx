import { FC } from "react";
import { Card, CardHeader, CardBody, HStack, Text, Box } from "@chakra-ui/react";

interface DeviceCardProps {
  device: Device;
  system: System;
  info?: Record<string, Record<string, string>>;
}

export const DeviceCard: FC<DeviceCardProps> = ({ device, system, info }) => {
  return (
    <Card p="16px 24px" minW="200px" boxShadow="md">
      <HStack justify="space-between" gap="16px">
        <CardHeader p="0">{device.FriendlyName}</CardHeader>

        {info?.device?.connected === "true" ? <Box w="10px" h="10px" rounded="md" bg="green.400" /> : null}
      </HStack>

      <CardBody mt="8px" p="0">
        {info?.device?.connected === "true" ? (
          <HStack justify="end">
            <Text fontSize="14px">Battery</Text>
            <Text fontSize="14px">{info?.system?.battery_level}%</Text>
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
