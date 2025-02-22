import { FC } from "react";
import { useShallow } from "zustand/shallow";
import { Button, DialogOpenChangeDetails, Stack } from "@chakra-ui/react";

import { useSystemStore } from "@app/stores/system.store";
import { useBluetoothStore } from "@app/stores/bluetooth.store";
import { DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogRoot } from "@app/components/ui/dialog";
import { BluetoothDeviceSection } from "./bluetooth-device-section";
import { BluetoothInfoSection } from "./bluetooth-info-section";

interface BluetoothDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BluetoothDialog: FC<BluetoothDialogProps> = ({ open, setOpen }) => {
  const { selectedDevice, selectedSystem, clearState } = useSystemStore(
    useShallow((state) => ({
      selectedDevice: state.selectedDevice,
      selectedSystem: state.selectedSystem,
      systemProperties: state.systemProperties,
      clearState: state.clearState,
    })),
  );
  const addDevice = useBluetoothStore((state) => state.addDevice);

  const handleChangeOpen = (e: DialogOpenChangeDetails) => {
    setOpen(e.open);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleAddDevice = () => {
    addDevice(selectedDevice, selectedSystem);

    handleCloseDialog();
    clearState();
  };

  return (
    <DialogRoot size="md" closeOnEscape open={open} onOpenChange={handleChangeOpen}>
      <DialogContent>
        <DialogCloseTrigger top="12px" right="12px" zIndex="1" />

        <DialogBody as={Stack} position="relative" gap="16px" p="24px">
          <BluetoothDeviceSection />

          <BluetoothInfoSection />
        </DialogBody>

        <DialogFooter>
          <Button size="sm" variant="ghost" mr={3} onClick={handleCloseDialog}>
            Close
          </Button>
          <Button size="sm" disabled={!selectedDevice || !selectedSystem} onClick={handleAddDevice}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
