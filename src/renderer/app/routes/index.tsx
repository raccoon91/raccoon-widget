import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";
import { Box } from "@chakra-ui/react";

import { useAppStore } from "@app/stores/app.store";
import { useBluetoothStore } from "@app/stores/bluetooth.store";
import { MainHeader } from "@app/components/layout/main-header";
import { BluetoothPanel } from "@app/components/bluetooth/bluetooth-panel";
import { WindowFrame } from "@app/components/layout/window-frame";

const Home = () => {
  const { mode, initAppInfo } = useAppStore(
    useShallow((state) => ({
      mode: state.mode,
      initAppInfo: state.initAppInfo,
    })),
  );
  const getDeviceByClass = useBluetoothStore((state) => state.getDeviceByClass);

  useEffect(() => {
    initAppInfo();
    getDeviceByClass("Bluetooth");
  }, []);

  return (
    <WindowFrame header={<MainHeader />} backgroundColor={mode === "display" ? "transparent" : undefined}>
      <Box p="16px 32px">
        <BluetoothPanel />
      </Box>
    </WindowFrame>
  );
};

export const Route = createFileRoute("/")({
  component: Home,
});
