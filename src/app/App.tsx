import { MouseEvent, useState } from "react";
import { Button, Flex, Heading, HStack, Stack, Text } from "@chakra-ui/react";

export const App = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [properties, setProperties] = useState<DeviceProperty[]>([]);

  const handleClickGetPairedBluetooth = async () => {
    const result = await window.electronAPI.getDeviceByClass("Bluetooth");

    if (!result) return;

    const devices = JSON.parse(result);

    setDevices(devices);
  };

  const handleClickBluetooth = async (e: MouseEvent<HTMLButtonElement>) => {
    const instanceId = e.currentTarget.dataset["instanceId"];

    console.log(instanceId);

    if (!instanceId) return;

    const result = await window.electronAPI.getDevicePropertyById(instanceId);

    if (!result) return;

    const properties = JSON.parse(result);

    setProperties(properties);
  };

  return (
    <Flex direction="column" w="vw" h="vh">
      <Heading>Hello World!</Heading>

      <Flex>
        <Button size="xs" onClick={handleClickGetPairedBluetooth}>
          Get Bluetooth
        </Button>
      </Flex>

      <HStack overflow="hidden" flex="1" gap="16px">
        <Stack overflowY="auto" gap="16px" flex="1" h="full">
          {devices.map((device) => (
            <HStack key={device.DeviceID} w="full" justify="space-between">
              <Text>{device.FriendlyName}</Text>

              <Button size="xs" data-instance-id={device.InstanceId} onClick={handleClickBluetooth}>
                Select
              </Button>
            </HStack>
          ))}
        </Stack>

        <Stack overflowY="auto" gap="12px" flex="2" h="full">
          {properties.map((property, index) => (
            <HStack key={index} w="full" gap="16px">
              <Text w="400px">{property.KeyName}</Text>
              <Text flex="1" truncate>
                {property.Data.toString()}
              </Text>
            </HStack>
          ))}
        </Stack>
      </HStack>
    </Flex>
  );
};
