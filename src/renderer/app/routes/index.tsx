import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";
import { Box } from "@chakra-ui/react";

import { useMainStore } from "@app/stores/main/main.store";
import { useMainStorageStore } from "@app/stores/main/main-storage.store";
import { useMainSessionStore } from "@app/stores/main/main-session.store";
import { useInterval } from "@app/hooks/useInterval";
import { MainHeader } from "@app/components/layout/main-header";
import { BluetoothPanel } from "@app/components/bluetooth/bluetooth-panel";
import { WindowFrame } from "@app/components/layout/window-frame";

const Home = () => {
  const { mode, getConfig, setDevtoolsStatus } = useMainStore(
    useShallow((state) => ({
      mode: state.mode,
      getConfig: state.getConfig,
      setDevtoolsStatus: state.setDevtoolsStatus,
    })),
  );
  const { getDeviceByClass, pullDeviceInfo } = useMainSessionStore(
    useShallow((state) => ({
      getDeviceByClass: state.getDeviceByClass,
      pullDeviceInfo: state.pullDeviceInfo,
    })),
  );

  useInterval(() => {
    pullDeviceInfo();
  });

  useEffect(() => {
    window.mainAppAPI.devtoolsStatusChanged((_, status) => {
      setDevtoolsStatus(status);
    });

    return () => {
      window.mainAppAPI.removeDevtoolsStatusChanged();
    };
  }, []);

  useEffect(() => {
    window.mainStorageAPI.storageChanged(() => {
      useMainStorageStore.persist.rehydrate()?.then(() => {
        pullDeviceInfo();
      });
    });

    return () => {
      window.mainStorageAPI.removeStorageChanged();
    };
  }, []);

  useEffect(() => {
    useMainStorageStore.persist.rehydrate()?.then(() => {
      getConfig();
      pullDeviceInfo();
      getDeviceByClass("Bluetooth");
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
