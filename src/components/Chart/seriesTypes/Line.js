import React, { useMemo } from "react";
import { line } from "d3-shape";

import { translate, isDefined } from "../utils/utils";
import { monotoneX } from "../utils/curveMonotone";
import useChartContext from "../utils/chartContext";

const Line = ({ primaryAxis, secondaryAxis, series: allSeries }) => {
  // console.log("allSeries: ", allSeries);
  // const deferredSeries = useDeferredValue(allSeries, { timeoutMs: 200 });
  // const isDeferred = allSeries !== deferredSeries;
  // console.log("line -> isDeferred: ", isDeferred);

  const {
    getSeriesStatusStyle,
    // getDatumStatusStyle,
    focusedDatumState,
    gridDimensions,
  } = useChartContext();

  const curve = secondaryAxis.curve ?? monotoneX;

  const [focusedDatum] = focusedDatumState;
  // const [focusedDatumDef] = focusedDatumState;
  // const focusedDatum = useDeferredValue(focusedDatumDef, { timeoutMs: 200 });
  // const isDeferredFocused = focusedDatumDef !== focusedDatum;
  // console.log("line -> isDeferredFocused: ", isDeferredFocused);

  return (
    <g
      style={{
        transform: translate(gridDimensions.left, gridDimensions.top),
      }}
    >
      {/* <Suspense fallback={<text>loading</text>}> */}
      {
        // isDeferred ? (
        //   <text>loading</text>
        // ) : (
        // deferredSeries.map((series, i) => {
        // !isDeferred &&
        //   deferredSeries.map((series, i) => {
        allSeries.map((series, i) => {
          const style = getSeriesStatusStyle(series, focusedDatum);
          // const style = isDeferred ? {} : getSeriesStatusStyle(series, focusedDatum);

          let areaPath = null;

          // if (secondaryAxis.elementType === "area") {
          //   const _x = (datum) => getPrimary(datum, primaryAxis);
          //   const _y1 = (datum) =>
          //     clampPxToAxis(
          //       getSecondaryStart(datum, secondaryAxis),
          //       secondaryAxis
          //     );
          //   const _y2 = (datum) =>
          //     clampPxToAxis(getSecondary(datum, secondaryAxis), secondaryAxis);
          //   const areaFn = area(_x, _y1, _y2).curve(curve);

          //   areaFn.defined((datum) =>
          //     [_x(datum), _y1(datum), _y2(datum)].every(isDefined)
          //   );

          //   areaPath = areaFn(series.datums);
          // }

          const _x = (datum) => getPrimary(datum, primaryAxis);
          const _y = (datum) => getSecondary(datum, secondaryAxis);
          const lineFn = line(_x, _y).curve(curve);
          lineFn.defined((datum) => [_x(datum), _y(datum)].every(isDefined));

          const linePath =
            secondaryAxis.elementType === "area" ||
            secondaryAxis.elementType === "line"
              ? lineFn(series.datums) ?? undefined
              : undefined;

          // const showDatumElements =
          //   secondaryAxis.showDatumElements ??
          //   (secondaryAxis.elementType === "bubble" || "onFocus");

          return (
            <g key={`lines-${i}`}>
              {areaPath ? (
                <path
                  d={areaPath}
                  style={{
                    strokeWidth: 2,
                    opacity: 0.5,
                    ...style,
                    ...style?.area,
                  }}
                />
              ) : null}
              {linePath ? (
                <path
                  d={linePath}
                  style={{
                    strokeWidth: 2,
                    ...style,
                    ...style?.line,
                    fill: "none",
                  }}
                />
              ) : null}
              <CirclesGroup
                datums={series.datums}
                primaryAxis={primaryAxis}
                secondaryAxis={secondaryAxis}
                style={style}
              />
              {/* <g>
                {series.datums.map((datum, i) => {
                  const dataStyle = getDatumStatusStyle(datum, focusedDatum);

                  const radius =
                    showDatumElements === "onFocus"
                      ? datum === focusedDatum
                        ? 4
                        : 0
                      : 2;

                  const show =
                    showDatumElements === "onFocus"
                      ? datum === focusedDatum
                      : secondaryAxis.showDatumElements ??
                        secondaryAxis.elementType === "bubble";

                  return (
                    <circle
                      key={i}
                      ref={(el) => {
                        datum.element = el;
                      }}
                      cx={getX(datum, primaryAxis, secondaryAxis) || 0}
                      cy={getY(datum, primaryAxis, secondaryAxis) || 0}
                      style={{
                        r: radius,
                        // transition: "all .3s ease-out",
                        ...style,
                        ...style.circle,
                        ...dataStyle,
                        ...dataStyle.circle,
                        ...(!show ? { opacity: 0 } : {}),
                      }}
                    />
                  );
                })}
              </g> */}
            </g>
          );
        })
        // )
      }
    </g>
  );
};

const CirclesGroup = ({ datums, secondaryAxis, primaryAxis, style }) => {
  const { getDatumStatusStyle, focusedDatumState } = useChartContext();

  const [focusedDatum] = focusedDatumState;

  const showDatumElements = useMemo(
    () =>
      secondaryAxis.showDatumElements ??
      (secondaryAxis.elementType === "bubble" || "onFocus"),
    [secondaryAxis.showDatumElements, secondaryAxis.elementType]
  );

  return (
    <g>
      {datums.map((datum, i) => {
        const dataStyle = getDatumStatusStyle(datum, focusedDatum);

        const radius =
          showDatumElements === "onFocus"
            ? datum === focusedDatum
              ? 4
              : 0
            : 2;

        const show =
          showDatumElements === "onFocus"
            ? datum === focusedDatum
            : secondaryAxis.showDatumElements ??
              secondaryAxis.elementType === "bubble";

        return (
          <circle
            key={i}
            ref={(el) => {
              datum.element = el;
            }}
            cx={getX(datum, primaryAxis, secondaryAxis) || 0}
            cy={getY(datum, primaryAxis, secondaryAxis) || 0}
            style={{
              r: radius,
              // transition: "all .3s ease-out",
              ...style,
              ...style.circle,
              ...dataStyle,
              ...dataStyle.circle,
              ...(!show ? { opacity: 0 } : {}),
            }}
          />
        );
      })}
    </g>
  );
};

export default Line;

const getX = (datum, primaryAxis, secondaryAxis) => {
  return primaryAxis.isVertical
    ? getSecondary(datum, secondaryAxis)
    : getPrimary(datum, primaryAxis);
};

const getY = (datum, primaryAxis, secondaryAxis) => {
  return primaryAxis.isVertical
    ? getPrimary(datum, primaryAxis)
    : getSecondary(datum, secondaryAxis);
};

const getPrimary = (datum, primaryAxis) => {
  let primary = primaryAxis.scale(datum.primaryValue) ?? NaN;

  if (primaryAxis.axisFamily === "band") {
    primary += primaryAxis.scale.bandwidth() / 2;
  }

  return primary;
};

const getSecondary = (datum, secondaryAxis) => {
  if (secondaryAxis.stacked) {
    return secondaryAxis.scale(datum.stackData?.[1] ?? NaN) ?? NaN;
  }

  return secondaryAxis.scale(datum.secondaryValue) ?? NaN;
};
