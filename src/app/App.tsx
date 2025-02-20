import { MouseEvent, useState } from "react";
import { Button, Center, Container, Flex, Heading, HStack, Spinner, Stack, Text } from "@chakra-ui/react";
import { SYSTEM_DEVICE_PROPERTY_NAMES } from "./constants/system";

export const App = () => {
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [properties, setProperties] = useState<DeviceProperty[]>([]);

  const handleClickGetPairedBluetooth = async () => {
    setLoading(true);

    const result = await window.electronAPI.getDeviceByClass("Bluetooth");

    if (!result) {
      setDevices([]);
      setLoading(false);

      return;
    }

    const devices = JSON.parse(result);

    setDevices(devices);
    setLoading(false);
  };

  const handleClickBluetooth = async (e: MouseEvent<HTMLButtonElement>) => {
    setLoading(true);

    const instanceId = e.currentTarget.dataset["instanceId"];

    if (!instanceId) {
      setProperties([]);
      setLoading(false);

      return;
    }

    const result = await window.electronAPI.getDevicePropertyById(instanceId);

    if (!result) {
      setProperties([]);
      setLoading(false);

      return;
    }

    const properties: DeviceProperty[] = JSON.parse(result);
    const filteredProperties = properties.filter((property) => SYSTEM_DEVICE_PROPERTY_NAMES.includes(property.KeyName));

    setProperties(filteredProperties);
    setLoading(false);
  };

  return (
    <Container w="vw" h="vh">
      {loading ? (
        <Center position="fixed" top="0" left="0" w="full" h="full">
          <Spinner size="xl" />
        </Center>
      ) : null}

      <Stack position="relative" direction="column" gap="24px" w="full" h="full">
        <Heading>Hello World!</Heading>

        <Flex>
          <Button size="xs" onClick={handleClickGetPairedBluetooth}>
            Get Bluetooth
          </Button>
        </Flex>

        <HStack overflow="hidden" flex="1" gap="32px">
          <Stack overflowY="auto" gap="12px" flex="1" h="full">
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
      </Stack>
    </Container>
  );
};
