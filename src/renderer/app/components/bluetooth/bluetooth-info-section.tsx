import { useShallow } from "zustand/shallow";
import { Box, Center, HStack, Separator, Spinner, Stack, Text } from "@chakra-ui/react";

import { PROPERTY_MAP } from "@/constants/shell";
import { useSessionStore } from "@app/stores/session.store";

export const BluetoothInfoSection = () => {
  const {
    loadingDevice,
    loadingProperty,
    propertyLoadingMessage,
    deviceProperties,
    selectedDevice,
    selectedSystem,
    systemProperties,
  } = useSessionStore(
    useShallow((state) => ({
      loadingDevice: state.loadingDevice,
      loadingProperty: state.loadingProperty,
      propertyLoadingMessage: state.propertyLoadingMessage,
      deviceProperties: state.deviceProperties,
      selectedDevice: state.selectedDevice,
      selectedSystem: state.selectedSystem,
      systemProperties: state.systemProperties,
    })),
  );

  return (
    <Stack gap="12px">
      <HStack h="24px">
        <Text fontSize="16px" fontWeight="semibold">
          Info
        </Text>
      </HStack>

      <Box
        position="relative"
        overflowY={loadingDevice ? "hidden" : "auto"}
        h="240px"
        border="1px solid"
        borderColor="fg.muted"
        rounded="md"
      >
        {loadingProperty ? (
          <Center
            position="absolute"
            top="0"
            left="0"
            flexDirection="column"
            gap="16px"
            w="full"
            h="full"
            bg="blackAlpha.800"
            zIndex="10"
          >
            <Spinner size="xl" borderWidth="4px" />
            <Text fontSize="14px">{propertyLoadingMessage}</Text>
          </Center>
        ) : null}

        {selectedDevice ? (
          <>
            <Text p="4px 12px" fontSize="14px" fontWeight="semibold">
              Device Property
            </Text>

            {deviceProperties.length ? (
              deviceProperties?.map((property, index) => (
                <HStack key={index} gap="16px" p="4px 12px">
                  <Text w="160px">{PROPERTY_MAP[property.KeyName].name}</Text>
                  <Text flex="1" truncate>
                    {property.Data.toString()}
                  </Text>
                </HStack>
              ))
            ) : (
              <Text p="4px 12px" fontSize="14px">
                No Device Property
              </Text>
            )}

            <Separator my="8px" />

            <Text p="4px 12px" fontSize="14px" fontWeight="semibold">
              System
            </Text>

            {selectedSystem ? (
              <HStack gap="16px" p="4px 12px">
                <Text w="160px" fontSize="14px">
                  system instance id
                </Text>
                <Text flex="1" truncate fontSize="14px">
                  {selectedDevice.InstanceId}
                </Text>
              </HStack>
            ) : (
              <Text p="4px 12px" fontSize="14px">
                No System
              </Text>
            )}

            <Separator my="8px" />

            <Text p="4px 12px" fontWeight="semibold" fontSize="14px">
              System Property
            </Text>

            {systemProperties.length ? (
              systemProperties.map((property, index) => (
                <HStack key={index} gap="16px" p="4px 12px">
                  <Text w="160px" fontSize="14px">
                    {PROPERTY_MAP[property.KeyName].name}
                  </Text>
                  <Text flex="1" truncate fontSize="14px">
                    {property.Data.toString()}
                  </Text>
                </HStack>
              ))
            ) : (
              <Text p="4px 12px" fontSize="14px">
                No System Property
              </Text>
            )}
          </>
        ) : (
          <Center flexDirection="column" gap="4px" w="full" h="full">
            <Text fontSize="14px">No Device</Text>
            <Text fontSize="14px">Select Device First</Text>
          </Center>
        )}
      </Box>
    </Stack>
  );
};
