import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";
import { Button, HStack, Stack } from "@chakra-ui/react";

import { useAppStore } from "@app/stores/app.store";
import { useSharedStore } from "@app/stores/shared.store";
import { useBluetoothStore } from "@app/stores/bluetooth.store";
import { WindowFrame } from "@app/components/layout/window-frame";
import { BluetoothDeviceSection } from "@app/components/bluetooth/bluetooth-device-section";
import { BluetoothInfoSection } from "@app/components/bluetooth/bluetooth-info-section";

const Bluetooth = () => {
  const addDevice = useSharedStore((state) => state.addDevice);
  const { getAppChildConfig, setChildDevtoolsStatus, closeChild } = useAppStore(
    useShallow((state) => ({
      getAppChildConfig: state.getAppChildConfig,
      setChildDevtoolsStatus: state.setChildDevtoolsStatus,
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
    window.appChildAPI.openChilWindow("/bluetooth");
    window.appChildAPI.childDevtoolsStatusChanged((_, status) => {
      setChildDevtoolsStatus("/bluetooth", status);
    });
  }, []);

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
