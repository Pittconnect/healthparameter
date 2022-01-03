import React, { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import useChartContext from "../utils/chartContext";
import { usePortalElement } from "../hooks/usePortalElement";
import { useLatestWhen } from "../hooks/useLatestWhen";
import { useRect } from "../hooks/useRect";
import TooltipRenderer from "./TooltipRenderer";
import { useAnchor } from "../hooks/useAnchor";
import { usePrevious } from "../hooks/usePrevious";
import { useSpring } from "../hooks/useSpring";

export const defaultTooltip = (options = {}) => {
  if (options === true) {
    options = { show: true };
  } else if (options === false) {
    options = { show: false };
  }

  return {
    show: true,
    ...options,
    align: options.align ?? "auto",
    alignPriority: options.alignPriority ?? [
      "right",
      "topRight",
      "bottomRight",
      "left",
      "topLeft",
      "bottomLeft",
      "top",
      "bottom",
    ],
    padding: options.padding ?? 5,
    arrowPadding: options.arrowPadding ?? 7,
    // anchor: options.anchor ?? 'closest',
    render: options.render ?? TooltipRenderer,
  };
};

const Tooltip = () => {
  const {
    focusedDatumState,
    getOptions,
    primaryAxis,
    secondaryAxes,
    getDatumStatusStyle,
    svgRef,
  } = useChartContext();

  const [focusedDatum] = focusedDatumState;
  const latestFocusedDatum = useLatestWhen(focusedDatum, !!focusedDatum);

  const secondaryAxis =
    secondaryAxes.find((d) => d.id === latestFocusedDatum?.secondaryAxisId) ??
    secondaryAxes[0];

  const portalEl = usePortalElement();

  const [tooltipEl, setTooltipEl] = useState();

  const svgRect = useRect(svgRef.current, !!focusedDatum?.element);

  const anchorEl = useMemo(() => {
    const anchorRect =
      latestFocusedDatum?.element?.getBoundingClientRect() ?? null;

    if (!anchorRect) {
      return null;
    }

    if (!svgRef) return;

    const translateX = anchorRect.left ?? 0;
    const translateY = anchorRect.top ?? 0;
    const width = anchorRect.width ?? 0;
    const height = anchorRect.height ?? 0;

    const box = {
      x: translateY,
      y: translateX,
      top: translateY,
      left: translateX,
      bottom: translateY + width,
      right: translateX + height,
      width: width,
      height: height,
      toJSON: () => {},
    };

    box.toJSON = () => box;

    return {
      getBoundingClientRect: () => {
        return box;
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestFocusedDatum?.element, svgRect]);

  const anchor = useAnchor({
    show: !!focusedDatum,
    portalEl,
    anchorEl,
    tooltipEl,
    side: ["right", "left", "top", "bottom"],
  });

  const previousAnchor = usePrevious(anchor);
  const latestStableAnchor = useLatestWhen(anchor, !!anchor.fit) ?? anchor;

  const { visibility, ...anchorStyle } = latestStableAnchor.style;

  const tooltipRef = useRef(null);

  const immediate = Number.isNaN(previousAnchor?.style.left);

  const tooltipXSpring = useSpring(
    anchorStyle.left || 0,
    [1, 210, 30],
    () => {
      if (tooltipRef.current) {
        tooltipRef.current.style.transform = `translate(${tooltipXSpring.x()}px, ${tooltipYSpring.x()}px)`;
      }
    },
    immediate
  );

  const tooltipYSpring = useSpring(
    anchorStyle.top || 0,
    [1, 210, 30],
    () => {
      if (tooltipRef.current) {
        tooltipRef.current.style.transform = `translate(${tooltipXSpring.x()}px, ${tooltipYSpring.x()}px)`;
      }
    },
    immediate
  );

  const show = getOptions().tooltip.show;

  const latestFit = useLatestWhen(anchor.fit, !!anchor.fit);

  return show && portalEl
    ? createPortal(
        <div
          ref={tooltipRef}
          style={{
            position: anchorStyle.position,
            opacity: !!focusedDatum ? 1 : 0,
            transition: "opacity .3s ease",
          }}
        >
          <div
            ref={(el) => setTooltipEl(el)}
            style={{
              fontFamily: "sans-serif",
              ...(latestFit?.startKey === "left"
                ? {
                    padding: "0 10px",
                  }
                : {
                    padding: "10px 0",
                  }),
            }}
          >
            {getOptions().tooltip.render({
              getOptions,
              focusedDatum: latestFocusedDatum,
              primaryAxis,
              secondaryAxes,
              secondaryAxis,
              getDatumStyle: (datum) =>
                getDatumStatusStyle(datum, focusedDatum),
              anchor,
            })}
          </div>
        </div>,
        portalEl
      )
    : null;
};

export default Tooltip;
