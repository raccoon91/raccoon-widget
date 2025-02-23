import { useEffect, useRef } from "react";

export const useInterval = (callback: () => void, delay = 1000 * 60 * 10) => {
  const savedCallback = useRef<() => void>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }

    const id = setInterval(tick, delay);

    return () => clearInterval(id);
  }, [delay]);
};
