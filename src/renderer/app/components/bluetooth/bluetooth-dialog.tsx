import { FC } from "react";
import { useShallow } from "zustand/shallow";
import { Button, DialogOpenChangeDetails, Stack } from "@chakra-ui/react";

import { useLocalStore } from "@app/stores/local.store";
import { useBluetoothStore } from "@app/stores/bluetooth.store";
import { DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogRoot } from "@app/components/ui/dialog";
import { BluetoothDeviceSection } from "./bluetooth-device-section";
import { BluetoothInfoSection } from "./bluetooth-info-section";

interface BluetoothDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BluetoothDialog: FC<BluetoothDialogProps> = ({ open, setOpen }) => {
  const addDevice = useLocalStore((state) => state.addDevice);
  const { selectedDevice, selectedSystem, clearDeviceState, pullDeviceInfo } = useBluetoothStore(
    useShallow((state) => ({
      selectedDevice: state.selectedDevice,
      selectedSystem: state.selectedSystem,
      systemProperties: state.systemProperties,
      clearDeviceState: state.clearDeviceState,
      pullDeviceInfo: state.pullDeviceInfo,
    })),
  );

  const handleChangeOpen = (e: DialogOpenChangeDetails) => {
    setOpen(e.open);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleAddDevice = () => {
    addDevice(selectedDevice, selectedSystem);

    handleCloseDialog();
    clearDeviceState();

    pullDeviceInfo();
  };

  return (
    <DialogRoot size="md" closeOnEscape open={open} onOpenChange={handleChangeOpen}>
      <DialogContent>
        <DialogCloseTrigger top="12px" right="12px" zIndex="1" />

        <DialogBody as={Stack} position="relative" gap="12px" p="24px">
          <BluetoothDeviceSection />

          <BluetoothInfoSection />
        </DialogBody>

        <DialogFooter>
          <Button size="xs" variant="ghost" mr={3} onClick={handleCloseDialog}>
            Close
          </Button>
          <Button size="xs" disabled={!selectedDevice || !selectedSystem} onClick={handleAddDevice}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
