import { useRef } from "react";

import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";

export const usePrevious = (val) => {
  const ref = useRef();

  useIsomorphicLayoutEffect(() => {
    ref.current = val;
  }, [val]);

  return ref.current;
};
