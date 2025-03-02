import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";
import { Button, HStack, Stack } from "@chakra-ui/react";

import { APP_CHILD_PATH } from "@/constants/app-child-path";
import { useAppChildStore } from "@app/stores/app-child.store";
import { useSharedStore } from "@app/stores/shared.store";
import { useBluetoothStore } from "@app/stores/bluetooth.store";
import { WindowFrame } from "@app/components/layout/window-frame";
import { BluetoothDeviceSection } from "@app/components/bluetooth/bluetooth-device-section";
import { BluetoothInfoSection } from "@app/components/bluetooth/bluetooth-info-section";

const Bluetooth = () => {
  const addDevice = useSharedStore((state) => state.addDevice);
  const { getAppChildConfig, setChildDevtoolsStatus, closeChild } = useAppChildStore(
    useShallow((state) => ({
      getAppChildConfig: state.getAppChildConfig,
      setChildDevtoolsStatus: state.setChildDevtoolsStatus,
      closeChild: state.closeChild,
    })),
  );
  // const { selectedDevice, selectedSystem, clearDeviceState, pullDeviceInfo } = useBluetoothStore(
  //   useShallow((state) => ({
  //     selectedDevice: state.selectedDevice,
  //     selectedSystem: state.selectedSystem,
  //     systemProperties: state.systemProperties,
  //     clearDeviceState: state.clearDeviceState,
  //     pullDeviceInfo: state.pullDeviceInfo,
  //   })),
  // );

  useEffect(() => {
    // window.appChildAPI.openChilWindow(APP_CHILD_PATH.BLUETOOTH_PATH);
    window.appChildAPI.childDevtoolsStatusChanged((_, status) => {
      setChildDevtoolsStatus(APP_CHILD_PATH.BLUETOOTH_PATH, status);
    });
  }, []);

  useEffect(() => {
    useBluetoothStore.persist.rehydrate();

    getAppChildConfig(APP_CHILD_PATH.BLUETOOTH_PATH);
  }, []);

  useEffect(() => {
    window.storageAPI.sessionChanged(() => {
      console.log("session changed");
      useBluetoothStore.persist.rehydrate();
    });
  }, []);

  const handleAddDevice = () => {
    window.storageAPI.updateStorage();
    // addDevice(selectedDevice, selectedSystem);

    // closeChild(APP_CHILD_PATH.BLUETOOTH_PATH);
    // clearDeviceState();

    // pullDeviceInfo();
  };

  return (
    <WindowFrame path={APP_CHILD_PATH.BLUETOOTH_PATH}>
      <Stack overflow="auto" flex="1" position="relative" gap="12px" p="24px">
        <BluetoothDeviceSection />

        <BluetoothInfoSection />
      </Stack>

      <HStack justify="end" p="8px 24px" bg="bg.subtle">
        {/* <Button size="xs" disabled={!selectedDevice || !selectedSystem} onClick={handleAddDevice}> */}
        <Button size="xs" onClick={handleAddDevice}>
          Add
        </Button>
      </HStack>
    </WindowFrame>
  );
};

export const Route = createFileRoute("/bluetooth")({
  component: Bluetooth,
});
