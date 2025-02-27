import { FC, PropsWithChildren, ReactNode } from "react";
import { Flex } from "@chakra-ui/react";
import { Header } from "./header";

interface WindowFrameProps {
  path?: string;
  header?: ReactNode;
  backgroundColor?: string;
}

export const WindowFrame: FC<PropsWithChildren<WindowFrameProps>> = ({
  path,
  header,
  backgroundColor = "blackAlpha.800",
  children,
}) => {
  return (
    <Flex overflow="hidden" w="vw" h="vh" flexDirection="column" backgroundColor={backgroundColor}>
      {header ? header : path ? <Header path={path} /> : null}

      {children}
    </Flex>
  );
};
