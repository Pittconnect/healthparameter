import React from "react";

import { translate } from "../utils/utils";
import useChartContext from "../utils/chartContext";

const Bar = ({ primaryAxis, secondaryAxis, series: allSeries }) => {
  const {
    getSeriesStatusStyle,
    getDatumStatusStyle,
    focusedDatumState,
    gridDimensions,
  } = useChartContext();

  const [focusedDatum] = focusedDatumState;

  const xAxis = primaryAxis.isVertical ? secondaryAxis : primaryAxis;
  const yAxis = primaryAxis.isVertical ? primaryAxis : secondaryAxis;

  return (
    <g
      style={{ transform: translate(gridDimensions.left, gridDimensions.top) }}
    >
      {allSeries.map((series, i) => {
        const style = getSeriesStatusStyle(series, focusedDatum);

        return (
          <g key={`lines-${i}`}>
            {series.datums.map((datum, i) => {
              const dataStyle = getDatumStatusStyle(datum, focusedDatum);

              const x = clampPxToAxis(
                0,
                getRectX(datum, primaryAxis, secondaryAxis) ?? NaN,
                xAxis
              );
              const y = clampPxToAxis(
                0,
                getRectY(datum, primaryAxis, secondaryAxis) ?? NaN,
                yAxis
              );
              const width = clampPxToAxis(
                x,
                getWidth(datum, primaryAxis, secondaryAxis) ?? NaN,
                xAxis
              );
              const height = clampPxToAxis(
                y,
                getHeight(datum, primaryAxis, secondaryAxis) ?? NaN,
                yAxis
              );

              return (
                <rect
                  {...{
                    ref: (el) => {
                      datum.element = el;
                    },
                    key: i,
                    x,
                    y,
                    width,
                    height,
                    style: {
                      strokeWidth: 0,
                      ...style,
                      ...style.rectangle,
                      ...dataStyle,
                      ...dataStyle.rectangle,
                    },
                  }}
                />
              );
            })}
          </g>
        );
      })}
    </g>
  );
};

export default Bar;

const getWidth = (datum, primaryAxis, secondaryAxis) => {
  return primaryAxis.isVertical
    ? getSecondaryLength(datum, secondaryAxis)
    : getPrimaryLength(datum, primaryAxis, secondaryAxis);
};

const getHeight = (datum, primaryAxis, secondaryAxis) => {
  return primaryAxis.isVertical
    ? getPrimaryLength(datum, primaryAxis, secondaryAxis)
    : getSecondaryLength(datum, secondaryAxis);
};

export const getPrimaryGroupLength = (_datum, primaryAxis) => {
  return Math.max(primaryAxis.primaryBandScale.bandwidth(), 1);
};

export const getPrimaryLength = (_datum, primaryAxis, secondaryAxis) => {
  if (primaryAxis.axisFamily === "band") {
    const bandWidth = secondaryAxis.stacked
      ? primaryAxis.scale.bandwidth()
      : primaryAxis.seriesBandScale.bandwidth();

    return Math.min(
      Math.max(bandWidth, primaryAxis.minBandSize ?? 1),
      primaryAxis.maxBandSize ?? 99999999
    );
  }

  return Math.max(
    secondaryAxis.stacked
      ? primaryAxis.primaryBandScale.bandwidth()
      : primaryAxis.seriesBandScale.bandwidth(),
    1
  );
};

const getSecondaryLength = (datum, secondaryAxis) => {
  const secondary = [
    getSecondaryStart(datum, secondaryAxis),
    getSecondary(datum, secondaryAxis),
  ];

  return Math.abs(secondary[1] - secondary[0]);
};

const getRectX = (datum, primaryAxis, secondaryAxis) => {
  return primaryAxis.isVertical
    ? getSecondaryStart(datum, secondaryAxis)
    : getPrimary(datum, primaryAxis, secondaryAxis);
};

const getRectY = (datum, primaryAxis, secondaryAxis) => {
  return primaryAxis.isVertical
    ? getPrimary(datum, primaryAxis, secondaryAxis)
    : getSecondary(datum, secondaryAxis);
};

export const getPrimary = (datum, primaryAxis, secondaryAxis) => {
  let primary = primaryAxis.scale(datum.primaryValue) ?? NaN;

  if (primaryAxis.axisFamily !== "band") {
    primary -= getPrimaryGroupLength(datum, primaryAxis) / 2;
  }

  if (!secondaryAxis.stacked) {
    primary = primary + (primaryAxis.seriesBandScale(datum.seriesIndex) ?? NaN);
  }

  return primary;
};

const getSecondaryStart = (datum, secondaryAxis) => {
  if (secondaryAxis.stacked) {
    return secondaryAxis.scale(datum.stackData?.[0] ?? NaN) ?? NaN;
  }

  return secondaryAxis.scale(0) ?? NaN;
};

const getSecondary = (datum, secondaryAxis) => {
  if (secondaryAxis.stacked) {
    return secondaryAxis.scale(datum.stackData?.[1] ?? NaN) ?? NaN;
  }

  return secondaryAxis.scale(datum.secondaryValue) ?? NaN;
};

const clampPxToAxis = (base, px, axis) => {
  const range = axis.scale.range();

  if (axis.isVertical) {
    range.reverse();
  }

  return Math.max(range[0], Math.min(px, range[1] - base));
};
