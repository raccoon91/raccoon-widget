import { FC } from "react";
import { Box, Center, Flex } from "@chakra-ui/react";
import { LuX } from "react-icons/lu";
import { BsTerminal, BsTerminalX } from "react-icons/bs";

interface HeaderProps {
  isDevToolsOpen: boolean;
  openDevTools: () => void;
  closeDevTools: () => void;
  closeWindow: () => void;
}

export const Header: FC<HeaderProps> = ({ isDevToolsOpen, openDevTools, closeDevTools, closeWindow }) => {
  const handleClickOpenChildDevTools = () => {
    openDevTools();
  };

  const handleClickCloseChildDevTools = () => {
    closeDevTools();
  };

  const handleCloseChildWindow = () => {
    closeWindow();
  };

  return (
    <Flex align="stretch" justify="end" gap="0" h="36px">
      <Box flex="1" css={{ WebkitAppRegion: "drag" }} bg="bg.subtle"></Box>
      {isDevToolsOpen ? (
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
