import { FC, PropsWithChildren, ReactNode } from "react";
import { Flex } from "@chakra-ui/react";

interface WindowFrameProps {
  header?: ReactNode;
  backgroundColor?: string;
}

export const WindowFrame: FC<PropsWithChildren<WindowFrameProps>> = ({
  header,
  backgroundColor = "blackAlpha.800",
  children,
}) => {
  return (
    <Flex overflow="hidden" w="vw" h="vh" flexDirection="column" backgroundColor={backgroundColor}>
      {header ? header : null}

      {children}
    </Flex>
  );
};
