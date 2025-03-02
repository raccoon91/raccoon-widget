import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";
import { Box } from "@chakra-ui/react";

import { useAppStore } from "@app/stores/app.store";
import { useSharedStore } from "@app/stores/shared.store";
import { useBluetoothStore } from "@app/stores/bluetooth.store";
import { MainHeader } from "@app/components/layout/main-header";
import { BluetoothPanel } from "@app/components/bluetooth/bluetooth-panel";
import { WindowFrame } from "@app/components/layout/window-frame";

const Home = () => {
  const { mode, getAppConfig, setDevtoolsStatus } = useAppStore(
    useShallow((state) => ({
      mode: state.mode,
      getAppConfig: state.getAppConfig,
      setDevtoolsStatus: state.setDevtoolsStatus,
    })),
  );
  const getDeviceByClass = useBluetoothStore((state) => state.getDeviceByClass);

  useEffect(() => {
    window.appAPI.devtoolsStatusChanged((_, status) => {
      setDevtoolsStatus(status);
    });
  }, []);

  useEffect(() => {
    useSharedStore.persist.rehydrate();

    getAppConfig();
    getDeviceByClass("Bluetooth").then(() => {
      console.log("get device done");
      window.storageAPI.updateSession();
    });
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
