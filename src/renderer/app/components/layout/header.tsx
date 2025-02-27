import { FC, useMemo } from "react";
import { Box, Center, Flex } from "@chakra-ui/react";
import { useShallow } from "zustand/shallow";
import { LuX } from "react-icons/lu";
import { BsTerminal, BsTerminalX } from "react-icons/bs";

import { useAppStore } from "@app/stores/app.store";

interface HeaderProps {
  path: string;
}

export const Header: FC<HeaderProps> = ({ path }) => {
  const { isChildDevToolsOpenMap, openChildDevTools, closeChildDevTools, closeChild } = useAppStore(
    useShallow((state) => ({
      isChildDevToolsOpenMap: state.isChildDevToolsOpenMap,
      openChildDevTools: state.openChildDevTools,
      closeChildDevTools: state.closeChildDevTools,
      closeChild: state.closeChild,
    })),
  );

  const isChildDevToolsOpen = useMemo(() => isChildDevToolsOpenMap?.[path], [isChildDevToolsOpenMap]);

  const handleClickOpenChildDevTools = () => {
    openChildDevTools(path);
  };

  const handleClickCloseChildDevTools = () => {
    closeChildDevTools(path);
  };

  const handleCloseChildWindow = () => {
    closeChild(path, {
      width: window.innerWidth,
      height: window.innerHeight,
      x: window.screenX,
      y: window.screenY,
    });
  };

  return (
    <Flex align="stretch" justify="end" gap="0" h="36px">
      <Box flex="1" css={{ WebkitAppRegion: "drag" }} bg="bg.subtle"></Box>
      {isChildDevToolsOpen ? (
        <Center
          px="12px"
          color="fg.subtle"
          _hover={{ bg: "bg.emphasized", cursor: "pointer" }}
          onClick={handleClickCloseChildDevTools}
        >
          <BsTerminalX size={20} />
        </Center>
      ) : (
        <Center
          px="12px"
          color="fg.subtle"
          _hover={{ bg: "bg.emphasized", cursor: "pointer" }}
          onClick={handleClickOpenChildDevTools}
        >
          <BsTerminal size={20} />
        </Center>
      )}
      <Center
        bg="bg.emphasized"
        px="12px"
        _hover={{ bg: "bg.warning", cursor: "pointer" }}
        onClick={handleCloseChildWindow}
      >
        <LuX size={20} />
      </Center>
    </Flex>
  );
};
