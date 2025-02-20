import { MouseEvent } from "react";
import { useShallow } from "zustand/shallow";
import { Button, Center, Container, Flex, Heading, HStack, Spinner, Stack, Text } from "@chakra-ui/react";

import { PROPERTY_MAP } from "./constants/system";
import { useSystemStore } from "./stores/system.store";

export const App = () => {
  const {
    loading,
    devices,
    deviceProperties,
    system,
    systemProperties,
    getDeviceByClass,
    getDevicePropertyById,
    getSystemByContainerId,
  } = useSystemStore(
    useShallow((state) => ({
      loading: state.loading,
      devices: state.devices,
      deviceProperties: state.deviceProperties,
      system: state.system,
      systemProperties: state.systemProperties,
      getDeviceByClass: state.getDeviceByClass,
      getDevicePropertyById: state.getDevicePropertyById,
      getSystemByContainerId: state.getSystemByContainerId,
    })),
  );

  const handleClickGetPairedBluetooth = async () => {
    getDeviceByClass("Bluetooth");
  };

  const handleClickBluetooth = async (e: MouseEvent<HTMLButtonElement>) => {
    const instanceId = e.currentTarget.dataset["instanceId"];

    getDevicePropertyById(instanceId);
  };

  const handleClickProperty = async (e: MouseEvent<HTMLButtonElement>) => {
    const containerId = e.currentTarget.dataset["containerId"];

    getSystemByContainerId(containerId);
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

        <Stack flex="1" gap="32px">
          <Stack overflowY="auto" gap="4px">
            {devices.map((device) => (
              <HStack key={device.DeviceID} w="full" justify="space-between">
                <Text>{device.FriendlyName}</Text>

                <Button size="xs" data-instance-id={device.InstanceId} onClick={handleClickBluetooth}>
                  Select
                </Button>
              </HStack>
            ))}
          </Stack>

          <Stack overflowY="auto" gap="4px">
            {deviceProperties.map((property, index) => (
              <HStack key={index} w="full" gap="16px">
                <Text w="480px">{PROPERTY_MAP[property.KeyName].name}</Text>
                <Text flex="1" truncate>
                  {property.Data.toString()}
                </Text>

                {property.KeyName === "DEVPKEY_Device_ContainerId" ? (
                  <Button size="xs" data-container-id={property.Data.toString()} onClick={handleClickProperty}>
                    Select
                  </Button>
                ) : null}
              </HStack>
            ))}
          </Stack>

          {system ? (
            <Stack gap="4px">
              <HStack w="full" gap="16px">
                <Text w="480px">container id</Text>
                <Text flex="1" truncate>
                  {system.InstanceId}
                </Text>
              </HStack>
            </Stack>
          ) : null}

          <Stack overflowY="auto" gap="4px">
            {systemProperties.map((property, index) => (
              <HStack key={index} w="full" gap="16px">
                <Text w="480px">{PROPERTY_MAP[property.KeyName].name}</Text>
                <Text flex="1" truncate>
                  {property.Data.toString()}
                </Text>
              </HStack>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};
