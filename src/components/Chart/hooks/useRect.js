import { useEffect, useRef, useState } from "react";
import observeRect from "@reach/observe-rect";

import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";

export const useRect = (node, enabled) => {
  const [element, setElement] = useState(node);

  let [rect, setRect] = useState({ width: 0, height: 0 });

  const rectRef = useRef(rect);

  rectRef.current = rect;

  useIsomorphicLayoutEffect(() => {
    if (node !== element) {
      setElement(node);
    }
  });

  useIsomorphicLayoutEffect(() => {
    if (enabled && element) {
      setRect(element.getBoundingClientRect());
    }
  }, [element, enabled]);

  useEffect(() => {
    if (!element || !enabled) {
      return;
    }

    const observer = observeRect(element, (newRect) => {
      setRect(newRect);
    });

    observer.observe();

    return () => {
      observer.unobserve();
    };
  }, [element, enabled]);

  return rect;
};
