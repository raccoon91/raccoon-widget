import { useEffect } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";
import { Button, HStack, Stack } from "@chakra-ui/react";

import { useBluetoothStore } from "@app/stores/bluetooth/bluetooth.store";
import { useBluetoothStorageStore } from "@app/stores/bluetooth/bluetooth-storage.store";
import { useBluetoothSessionStore } from "@app/stores/bluetooth/bluetooth-session.store";
import { WindowFrame } from "@app/components/layout/window-frame";
import { Header } from "@app/components/layout/header";
import { BluetoothDeviceSection } from "@app/components/bluetooth/bluetooth-device-section";
import { BluetoothInfoSection } from "@app/components/bluetooth/bluetooth-info-section";

const Bluetooth = () => {
  const addDevice = useBluetoothStorageStore((state) => state.addDevice);
  const { isDevToolsOpen, getConfig, setDevtoolsStatus, openDevTools, closeDevTools, close } = useBluetoothStore(
    useShallow((state) => ({
      isDevToolsOpen: state.isDevToolsOpen,
      getConfig: state.getConfig,
      setDevtoolsStatus: state.setDevtoolsStatus,
      openDevTools: state.openDevTools,
      closeDevTools: state.closeDevTools,
      close: state.close,
    })),
  );
  const { selectedDevice, selectedSystem, clearDeviceState } = useBluetoothSessionStore(
    useShallow((state) => ({
      selectedDevice: state.selectedDevice,
      selectedSystem: state.selectedSystem,
      systemProperties: state.systemProperties,
      clearDeviceState: state.clearDeviceState,
    })),
  );

  useEffect(() => {
    window.bluetoothAppAPI.devtoolsStatusChanged((_, status) => {
      setDevtoolsStatus(status);
    });

    return () => {
      window.bluetoothAppAPI.removeDevtoolsStatusChanged();
    };
  }, []);

  useEffect(() => {
    useBluetoothStorageStore.persist.rehydrate()?.then(() => {
      useBluetoothSessionStore.persist.rehydrate();

      getConfig();
    });
  }, []);

  useEffect(() => {
    window.bluetoothStorageAPI.sessionChanged(() => {
      useBluetoothSessionStore.persist.rehydrate();
    });

    return () => {
      window.bluetoothStorageAPI.removeSessionChanged();
    };
  }, []);

  const handleClickOpenDevTools = () => {
    openDevTools();
  };

  const handleClickCloseDevTools = () => {
    closeDevTools();
  };

  const handleCloseWindow = () => {
    close({
      width: window.innerWidth,
      height: window.innerHeight,
      x: window.screenX,
      y: window.screenY,
    });
  };

  const handleAddDevice = () => {
    addDevice(selectedDevice, selectedSystem);

    close({
      width: window.innerWidth,
      height: window.innerHeight,
      x: window.screenX,
      y: window.screenY,
    });
    clearDeviceState();
  };

  return (
    <WindowFrame
      header={
        <Header
          isDevToolsOpen={isDevToolsOpen}
          openDevTools={handleClickOpenDevTools}
          closeDevTools={handleClickCloseDevTools}
          closeWindow={handleCloseWindow}
        />
      }
    >
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

export const Route = createLazyFileRoute("/bluetooth")({
  component: Bluetooth,
});
