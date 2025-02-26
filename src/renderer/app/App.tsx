import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { Box } from "@chakra-ui/react";

import { useAppStore } from "@app/stores/app.store";
import { Header } from "@app/components/layout/header";
import { BluetoothPanel } from "@app/components/bluetooth/bluetooth-panel";

export const App = () => {
  const { mode, initAppInfo } = useAppStore(
    useShallow((state) => ({
      mode: state.mode,
      initAppInfo: state.initAppInfo,
    })),
  );

  useEffect(() => {
    initAppInfo();
  }, []);

  return (
    <Box overflow="hidden" w="vw" h="vh" backgroundColor={mode === "setting" ? "blackAlpha.700" : "transparent"}>
      <Header />

      <Box p="16px 32px">
        <BluetoothPanel />
      </Box>
    </Box>
  );
};
