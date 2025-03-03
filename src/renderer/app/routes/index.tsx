import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";
import { Box } from "@chakra-ui/react";

import { useAppStore } from "@app/stores/app.store";
import { useSavedStore } from "@app/stores/saved.store";
import { useSessionStore } from "@app/stores/session.store";
import { useInterval } from "@app/hooks/useInterval";
import { MainHeader } from "@app/components/layout/main-header";
import { BluetoothPanel } from "@app/components/bluetooth/bluetooth-panel";
import { WindowFrame } from "@app/components/layout/window-frame";

const Home = () => {
  const { mode, getConfig, setDevtoolsStatus } = useAppStore(
    useShallow((state) => ({
      mode: state.mode,
      getConfig: state.getConfig,
      setDevtoolsStatus: state.setDevtoolsStatus,
    })),
  );
  const { getDeviceByClass, pullDeviceInfo } = useSessionStore(
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
      console.log("storage updated");
      useSavedStore.persist.rehydrate();
    });

    return () => {
      window.mainStorageAPI.removeStorageChanged();
    };
  }, []);

  useEffect(() => {
    useSavedStore.persist.rehydrate()?.then(() => {
      getConfig();
      pullDeviceInfo();
      getDeviceByClass("Bluetooth").then(() => {
        console.log("get device done");
        window.mainStorageAPI.updateSession();
      });
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
