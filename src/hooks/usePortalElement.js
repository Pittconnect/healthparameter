import { useState } from "react";

import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";

export const usePortalElement = (elementId) => {
  const [portalEl, setPortalEl] = useState();

  useIsomorphicLayoutEffect(() => {
    if (!portalEl) {
      let element = document.getElementById(elementId);
      if (!element) {
        element = document.createElement("div");

        element.setAttribute("id", elementId);

        Object.assign(element.style, {
          pointerEvents: "none",
          position: "fixed",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          "z-index": 99999999999,
        });

        document.body.append(element);
      }

      setPortalEl(element);
    }
  });

  return portalEl;
};
