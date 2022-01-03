import { useMemo } from "react";

import { useRect } from "./useRect";

const sideSchemas = {
  left: {
    side: "left",
    startKey: "left",
    lengthKey: "width",
    crossStartKey: "top",
    crossLengthKey: "height",
    fromEnd: false,
  },
  right: {
    side: "right",
    startKey: "left",
    lengthKey: "width",
    crossStartKey: "top",
    crossLengthKey: "height",
    fromEnd: true,
  },
  top: {
    side: "top",
    startKey: "top",
    lengthKey: "height",
    crossStartKey: "left",
    crossLengthKey: "width",
    fromEnd: false,
  },
  bottom: {
    side: "bottom",
    startKey: "top",
    lengthKey: "height",
    crossStartKey: "left",
    crossLengthKey: "width",
    fromEnd: true,
  },
};

export const useAnchor = (options) => {
  const portalDims = useRect(options.portalEl, options.show);
  const anchorDims = useRect(options.anchorEl, options.show);
  const tooltipDims = useRect(options.tooltipEl, options.show);

  const sides = useMemo(() => {
    const preSides = Array.isArray(options.side)
      ? options.side
      : [options.side];
    return preSides.map((alignStr) => {
      const [side, align = "center"] = alignStr.split(" ");
      const incompatibleSide = !["top", "right", "bottom", "left"].find(
        (d) => side === d
      );

      if (incompatibleSide) {
        throw new Error(
          `react-sticker: "${side}" is not a valid side! Must be one of ['top', 'right', 'bottom', 'left'].`
        );
      }

      const incompatibleAlign = ![
        "center",
        "start",
        "end",
        "top",
        "right",
        "bottom",
        "left",
      ].find((d) => align === d);

      if (incompatibleAlign) {
        throw new Error(
          `react-sticker: "${align}" is not a valid side-alignment! Must be one of ['center', 'start', 'end', 'top', 'right', 'bottom', 'left'].`
        );
      }

      return [side, align];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(options.side)]);

  const ready = portalDims && tooltipDims && anchorDims;

  const fit = useMemo(
    () =>
      ready && options.show
        ? fitOnBestSide({
            portalDims,
            tooltipDims,
            anchorDims,
            sides,
            useLargest: options.useLargest,
          })
        : null,
    [
      anchorDims,
      options.show,
      options.useLargest,
      portalDims,
      ready,
      sides,
      tooltipDims,
    ]
  );

  return {
    fit,
    style: {
      position: "absolute",
      visibility: ready ? "visible" : "hidden",
      ...fit?.style,
    },
  };
};

const fitOnBestSide = ({
  portalDims,
  tooltipDims,
  anchorDims,
  sides,
  useLargest,
}) => {
  const fits = sides.map(([side, align]) =>
    measureFit({
      ...sideSchemas[side],
      align,
      portalDims,
      tooltipDims,
      anchorDims,
    })
  );

  if (useLargest) {
    fits.sort((a, b) => b.fitRatio - a.fitRatio);
    return fits[0];
  }

  return fits.find((fit) => fit.fitRatio >= 1) || fits[0];
};

const measureFit = ({
  side,
  align,
  startKey,
  lengthKey,
  crossStartKey,
  crossLengthKey,
  fromEnd,
  portalDims,
  tooltipDims,
  anchorDims,
}) => {
  const parentStart = portalDims[startKey];
  const parentLength = portalDims[lengthKey];
  const crossParentStart = portalDims[crossStartKey];
  const crossParentLength = portalDims[crossLengthKey];
  const anchorStart = anchorDims[startKey] - portalDims[startKey];
  const anchorLength = anchorDims[lengthKey];
  const crossAnchorStart = anchorDims[crossStartKey];
  const crossAnchorLength = anchorDims[crossLengthKey];
  const crossAnchorWidth = anchorDims[crossLengthKey];
  const targetLength = tooltipDims[lengthKey];
  const crossTargetLength = tooltipDims[crossLengthKey];

  let targetStart;
  let fitRatio;

  if (!fromEnd) {
    targetStart = anchorStart - targetLength;
    fitRatio = Math.min(anchorStart / targetLength);
  } else {
    targetStart = anchorStart + anchorLength;
    fitRatio = (parentLength - (anchorStart + anchorLength)) / targetLength;
  }

  targetStart = Math.max(parentStart, Math.min(targetStart, parentLength));

  let crossTargetStart;

  if (startKey === "left") {
    if (align === "top") {
      align = "start";
    } else if (align === "bottom") {
      align = "end";
    }
  } else {
    if (align === "left") {
      align = "start";
    } else if (align === "right") {
      align = "end";
    }
  }

  if (!["start", "center", "end"].includes(align)) {
    align = "center";
  }

  if (align === "start") {
    crossTargetStart = crossAnchorStart;
  } else if (align === "end") {
    crossTargetStart = crossAnchorStart + crossAnchorWidth - crossTargetLength;
  } else {
    crossTargetStart =
      crossAnchorStart + crossAnchorLength / 2 - crossTargetLength / 2;
  }

  crossTargetStart = Math.max(
    crossParentStart,
    Math.min(crossTargetStart, crossParentLength - crossTargetLength)
  );

  return {
    side,
    align,
    startKey,
    lengthKey,
    crossStartKey,
    crossLengthKey,
    fromEnd,
    portalDims,
    tooltipDims,
    anchorDims,
    fitRatio,
    style: {
      [startKey]: targetStart,
      [crossStartKey]: crossTargetStart,
    },
  };
};
