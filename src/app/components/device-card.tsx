import { FC } from "react";
import { Card, CardHeader, CardBody, HStack, Text } from "@chakra-ui/react";

interface DeviceCardProps {
  device: Device;
  system: System;
  info?: Record<string, Record<string, string>>;
}

export const DeviceCard: FC<DeviceCardProps> = ({ device, system, info }) => {
  return (
    <Card>
      <CardHeader pb="0">{device.FriendlyName}</CardHeader>

      <CardBody>
        <HStack>
          <Text>Battery</Text>
          <Text>{info?.system?.battery_level}</Text>
        </HStack>
        <HStack>
          <Text>Device Connected</Text>
          <Text>{info?.device?.connected}</Text>
        </HStack>
        <HStack>
          <Text>System Connected</Text>
          <Text>{info?.system?.connected}</Text>
        </HStack>
      </CardBody>
    </Card>
  );
};
