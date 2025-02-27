import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";
import { Button, HStack, Stack } from "@chakra-ui/react";

import { useLocalStore } from "@app/stores/local.store";
import { useAppStore } from "@app/stores/app.store";
import { useBluetoothStore } from "@app/stores/bluetooth.store";
import { WindowFrame } from "@app/components/layout/window-frame";
import { BluetoothDeviceSection } from "@app/components/bluetooth/bluetooth-device-section";
import { BluetoothInfoSection } from "@app/components/bluetooth/bluetooth-info-section";

const Bluetooth = () => {
  const addDevice = useLocalStore((state) => state.addDevice);
  const { getAppChildConfig, closeChild } = useAppStore(
    useShallow((state) => ({
      getAppChildConfig: state.getAppChildConfig,
      closeChild: state.closeChild,
    })),
  );
  const { selectedDevice, selectedSystem, clearDeviceState, pullDeviceInfo } = useBluetoothStore(
    useShallow((state) => ({
      selectedDevice: state.selectedDevice,
      selectedSystem: state.selectedSystem,
      systemProperties: state.systemProperties,
      clearDeviceState: state.clearDeviceState,
      pullDeviceInfo: state.pullDeviceInfo,
    })),
  );

  useEffect(() => {
    getAppChildConfig("/bluetooth");
  }, []);

  const handleAddDevice = () => {
    addDevice(selectedDevice, selectedSystem);

    closeChild("/bluetooth");
    clearDeviceState();

    pullDeviceInfo();
  };

  return (
    <WindowFrame path="/bluetooth">
      <Stack overflow="auto" flex="1" position="relative" gap="12px" p="24px">
        <BluetoothDeviceSection />

        <BluetoothInfoSection />
      </Stack>

      <HStack justify="end" p="8px 24px" bg="bg.subtle">
        <Button size="xs" disabled={!selectedDevice || !selectedSystem} onClick={handleAddDevice}>
          Add
        </Button>
      </HStack>
    </WindowFrame>
  );
};

export const Route = createFileRoute("/bluetooth")({
  component: Bluetooth,
});
