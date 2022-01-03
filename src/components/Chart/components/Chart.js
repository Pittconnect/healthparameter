import React, {
  useDeferredValue,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { groups, sort, sum } from "d3-array";

import Tooltip, { defaultTooltip } from "./Tooltip";
import AxisLinear from "./AxisLinear";
import Line from "../seriesTypes/Line";
import { getPrimary } from "../seriesTypes/Bar";
import useIsomorphicLayoutEffect from "../hooks/useIsomorphicLayoutEffect";
import { useGetLatest } from "../hooks/useGetLatest";
import { buildAxisLinear } from "../utils/buildAxis.linear";
import { ChartContextProvider } from "../utils/chartContext";
import {
  getDatumStatus,
  getSeriesStatus,
  materializeStyles,
} from "../utils/utils";
import Voronoi from "./Voronoi";
import Cursors from "./Cursors";

const defaultColorScheme = [
  "#0f83ab",
  "#faa43a",
  "#fd6868",
  "#53cfc9",
  "#a2d925",
  "#decf3f",
  "#734fe9",
  "#cd82ad",
  "#006d92",
  "#de7c00",
  "#f33232",
  "#3f9a80",
  "#53c200",
  "#d7af00",
  "#4c26c9",
  "#d44d99",
  "#07004d",
  "#ee6c4d",
  "#9b2226",
  "#0e9594",
  "#f4a261",
  "#d00000",
  "#94d2bd",
  "#008000",
  // "#fee440",
  // "#e0aaff",
];

const defaultPadding = 5;

const defaultChartOptions = (options) => {
  return {
    ...options,
    initialWidth: options.initialWidth ?? null,
    initialHeight: options.initialHeight ?? null,
    // initialWidth: options.initialWidth ?? 300,
    // initialHeight: options.initialHeight ?? 200,
    getSeriesOrder: options.getSeriesOrder ?? ((series) => series),
    interactionMode: options.interactionMode ?? "primary",
    groupedIndexes: options.groupedIndexes ?? [],
    showVoronoi: options.showVoronoi ?? false,
    defaultColors: options.defaultColors ?? defaultColorScheme,
    useIntersectionObserver: options.useIntersectionObserver ?? true,
    intersectionObserverRootMargin:
      options.intersectionObserverRootMargin ?? "1000px",
    primaryCursor: options.primaryCursor ?? true,
    secondaryCursor: options.secondaryCursor ?? true,
    padding: options.padding ?? defaultPadding,
  };
};

export const Chart = ({
  options: userOptions,
  className,
  style = {},
  ...rest
}) => {
  const options = defaultChartOptions(userOptions);
  const [chartElement, setContainerElement] = useState(null);

  const containerEl = chartElement?.parentElement;

  const nearestScrollableParent = useMemo(() => {
    const run = (el) => {
      if (!el) {
        return null;
      }

      const grandParent = el.parentElement;

      if (!grandParent) {
        return null;
      }

      if (grandParent.scrollHeight > grandParent.clientHeight) {
        const { overflow } = window.getComputedStyle(grandParent);

        if (overflow.includes("scroll") || overflow.includes("auto")) {
          return grandParent;
        }
      }

      return run(grandParent);
    };

    return run(containerEl);
  }, [containerEl]);

  const [{ width, height }, setDims] = useState({
    width: options.initialWidth,
    height: options.initialHeight,
  });

  useIsomorphicLayoutEffect(() => {
    if (containerEl) {
      const computed = window.getComputedStyle(containerEl);

      if (!["relative", "absolute", "fixed"].includes(computed.position)) {
        containerEl.style.position = "relative";
      }
    }
  }, [containerEl]);

  useEffect(() => {
    if (!containerEl) {
      return;
    }

    const observer = new ResizeObserver(() => {
      const rect = containerEl?.getBoundingClientRect();
      const styles = window.getComputedStyle(containerEl);

      if (rect) {
        setDims({
          width:
            rect.width -
            parseInt(styles.borderLeftWidth) -
            parseInt(styles.borderRightWidth),
          height:
            rect.height -
            parseInt(styles.borderTopWidth) -
            parseInt(styles.borderBottomWidth),
        });
      }
    });

    observer.observe(containerEl);

    return () => {
      observer.unobserve(containerEl);
    };
  }, [containerEl]);

  const [isIntersecting, setIsIntersecting] = useState(true);

  useEffect(() => {
    if (!containerEl || !options.useIntersectionObserver) return;

    let observer = new IntersectionObserver(
      (entries) => {
        for (let entry of entries) {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
          } else {
            setIsIntersecting(false);
          }
        }
      },
      {
        root: nearestScrollableParent,
        rootMargin: options.intersectionObserverRootMargin,
      }
    );

    observer.observe(containerEl);

    return () => {
      observer.unobserve(containerEl);
    };
  }, [
    containerEl,
    nearestScrollableParent,
    options.intersectionObserverRootMargin,
    options.useIntersectionObserver,
  ]);

  return (
    <div
      ref={setContainerElement}
      {...rest}
      className={`react-chart-container ${className || ""}`}
      style={{
        fontFamily: "sans-serif",
        ...style,
        position: "absolute",
        width,
        height,
      }}
    >
      {width && height && isIntersecting ? (
        // {isIntersecting ? (
        <ChartInner options={options} {...{ width, height }} />
      ) : null}
    </div>
  );
};

const ChartInner = ({ options, width, height }) => {
  if (!options.primaryAxis) {
    throw new Error("A primaryAxis is required");
  }

  if (!options.secondaryAxes.length) {
    throw new Error("At least one secondaryAxis is required");
  }

  const primaryAxisOptions = useMemo(() => {
    const firstValue = getFirstDefinedValue(options.primaryAxis, options.data);
    const axisOptions = axisOptionsWithScaleType(
      options.primaryAxis,
      firstValue
    );

    return { position: "bottom", ...axisOptions };
  }, [options.data, options.primaryAxis]);

  const secondaryAxesOptions = useMemo(() => {
    return options.secondaryAxes.map((secondaryAxis, i) => {
      const firstValue = getFirstDefinedValue(secondaryAxis, options.data);

      const axisOptions = axisOptionsWithScaleType(secondaryAxis, firstValue);

      if (!axisOptions.elementType) {
        if (primaryAxisOptions.scaleType === "band") {
          axisOptions.elementType = "bar";
        } else if (axisOptions.stacked) {
          axisOptions.elementType = "area";
        }
      }

      if (
        typeof axisOptions.stacked === "undefined" &&
        axisOptions.elementType &&
        ["area"].includes(axisOptions.elementType)
      ) {
        axisOptions.stacked = true;
      }

      return {
        position: !i ? "left" : "right",
        ...axisOptions,
      };
    });
  }, [options.data, options.secondaryAxes, primaryAxisOptions]);

  const tooltipOptions = useMemo(() => {
    const tooltipOptions = defaultTooltip(options?.tooltip);
    tooltipOptions.groupingMode =
      tooltipOptions.groupingMode ??
      (() => {
        if (options.interactionMode === "closest") {
          return "single";
        }
        return "primary";
      })();

    return tooltipOptions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.interactionMode, options?.tooltip]);

  options = {
    ...options,
    tooltip: tooltipOptions,
  };

  const svgRef = useRef(null);
  const getOptions = useGetLatest({
    ...options,
    tooltip: tooltipOptions,
  });

  const axisDimensionsState = useState({
    left: {},
    right: {},
    top: {},
    bottom: {},
  });
  const [axisDimensions] = axisDimensionsState;

  const isAxisDemensionsReady = useMemo(
    () =>
      Object.values(axisDimensions).some(
        (value) => Object.keys(value).length !== 0
      ),
    [axisDimensions]
  );

  const focusedDatumState = useState(null);
  const [focusedDatum] = focusedDatumState;

  const gridDimensions = useMemo(() => {
    const padding = {
      left:
        typeof options.padding === "object"
          ? options.padding.left ?? defaultPadding
          : options.padding,
      right:
        typeof options.padding === "object"
          ? options.padding.right ?? defaultPadding
          : options.padding,
      bottom:
        typeof options.padding === "object"
          ? options.padding.bottom ?? defaultPadding
          : options.padding,
      top:
        typeof options.padding === "object"
          ? options.padding.top ?? defaultPadding
          : options.padding,
    };

    const left =
      padding.left +
      Math.max(
        sum(Object.values(axisDimensions.left), (d) => d.width),
        sum(Object.values(axisDimensions.top), (d) => d.paddingLeft),
        sum(Object.values(axisDimensions.bottom), (d) => d.paddingLeft)
      );

    const top =
      padding.top +
      Math.max(
        sum(Object.values(axisDimensions.top), (d) => d.height),
        sum(Object.values(axisDimensions.left), (d) => d.paddingTop),
        sum(Object.values(axisDimensions.right), (d) => d.paddingTop)
      );

    const right =
      padding.right +
      Math.max(
        sum(Object.values(axisDimensions.right), (d) => d.width),
        sum(Object.values(axisDimensions.top), (d) => d.paddingRight),
        sum(Object.values(axisDimensions.bottom), (d) => d.paddingRight)
      );

    const bottom =
      padding.bottom +
      Math.max(
        sum(Object.values(axisDimensions.bottom), (d) => d.height),
        sum(Object.values(axisDimensions.left), (d) => d.paddingBottom),
        sum(Object.values(axisDimensions.right), (d) => d.paddingBottom)
      );

    const gridWidth = Math.max(0, width - left - right);
    const gridHeight = Math.max(0, height - top - bottom);

    return { left, top, right, bottom, width: gridWidth, height: gridHeight };
  }, [
    options.padding,
    axisDimensions.left,
    axisDimensions.top,
    axisDimensions.bottom,
    axisDimensions.right,
    width,
    height,
  ]);

  const series = useMemo(() => {
    const series = [];

    const indicesByAxisId = {};

    for (
      let seriesIndex = 0;
      seriesIndex < options.data.length;
      seriesIndex++
    ) {
      const originalSeries = options.data[seriesIndex];
      const seriesId = originalSeries.id ?? seriesIndex + "";
      const seriesLabel = originalSeries.label ?? `Series ${seriesIndex + 1}`;
      const secondaryAxisId = originalSeries.secondaryAxisId;
      const originalDatums = originalSeries.data;
      const datums = [];

      indicesByAxisId[`${secondaryAxisId}`] =
        indicesByAxisId[`${secondaryAxisId}`] ?? 0;
      const seriesIndexPerAxis = indicesByAxisId[`${secondaryAxisId}`];

      indicesByAxisId[`${secondaryAxisId}`]++;

      for (
        let datumIndex = 0;
        datumIndex < originalDatums.length;
        datumIndex++
      ) {
        const originalDatum = originalDatums[datumIndex];
        datums[datumIndex] = {
          originalSeries,
          seriesIndex,
          seriesIndexPerAxis,
          seriesId,
          seriesLabel,
          secondaryAxisId,
          index: datumIndex,
          originalDatum,
        };
      }

      series[seriesIndex] = {
        originalSeries,
        index: seriesIndex,
        id: seriesId,
        label: seriesLabel,
        indexPerAxis: seriesIndexPerAxis,
        secondaryAxisId,
        datums,
      };
    }

    return series;
  }, [options.data]);

  const allDatums = useMemo(() => {
    return series.map((s) => s.datums).flat(2);
  }, [series]);

  const primaryAxis = useMemo(() => {
    return buildAxisLinear(
      true,
      primaryAxisOptions,
      series,
      allDatums,
      gridDimensions,
      width,
      height
    );
  }, [allDatums, gridDimensions, height, primaryAxisOptions, series, width]);

  const secondaryAxes = useMemo(() => {
    return secondaryAxesOptions.map((secondaryAxis) => {
      return buildAxisLinear(
        false,
        secondaryAxis,
        series,
        allDatums,
        gridDimensions,
        width,
        height
      );
    });
  }, [allDatums, gridDimensions, height, secondaryAxesOptions, series, width]);

  const allGroupedDatums = useMemo(() => {
    const activeTooltipGroupIndexes = options.groupedIndexes.concat(
      focusedDatum?.seriesIndex
    );

    if (activeTooltipGroupIndexes.length) {
      return allDatums.filter(({ seriesIndex }) =>
        activeTooltipGroupIndexes.some(
          (groupingIndex) => groupingIndex === seriesIndex
        )
      );
    }

    return allDatums;
  }, [allDatums, options.groupedIndexes, focusedDatum]);

  const [datumsByTooltipGroup] = useMemo(() => {
    const datumsByTooltipGroup = new Map();

    let getTooltipKey = (datum) => `${datum.primaryValue}`;

    if (tooltipOptions.groupingMode === "single") {
      getTooltipKey = (datum) =>
        `${datum.primaryValue}_${datum.secondaryValue}`;
    } else if (tooltipOptions.groupingMode === "secondary") {
      getTooltipKey = (datum) => `${datum.secondaryValue}`;
    } else if (tooltipOptions.groupingMode === "series") {
      getTooltipKey = (datum) => `${datum.seriesIndex}`;
    }

    allGroupedDatums.forEach((datum) => {
      const tooltipKey = getTooltipKey(datum);

      if (!datumsByTooltipGroup.has(tooltipKey)) {
        datumsByTooltipGroup.set(tooltipKey, []);
      }

      datumsByTooltipGroup.get(tooltipKey).push(datum);
    });

    datumsByTooltipGroup.forEach((value, key) => {
      datumsByTooltipGroup.set(
        key,
        sortDatumsBySecondaryPx(value, secondaryAxes)
      );
    });

    allGroupedDatums.forEach((datum) => {
      const tooltipKey = getTooltipKey(datum);

      datum.tooltipGroup = datumsByTooltipGroup.get(tooltipKey);
    });

    return [datumsByTooltipGroup];
  }, [allGroupedDatums, secondaryAxes, tooltipOptions.groupingMode]);

  const [datumsByInteractionGroup] = useMemo(() => {
    const datumsByInteractionGroup = new Map();

    let getInteractionPrimary = (datum) => {
      if (secondaryAxes.every((d) => d.elementType === "bar" && !d.stacked)) {
        const secondaryAxis = secondaryAxes.find(
          (d) => d.id === datum.secondaryAxisId
        );

        if (secondaryAxis.elementType === "bar" && !secondaryAxis.stacked) {
          return getPrimary(datum, primaryAxis, secondaryAxis);
        }
      }

      return datum.primaryValue;
    };

    let getInteractionKey = (datum) => `${getInteractionPrimary(datum)}`;

    if (options.interactionMode === "closest") {
      getInteractionKey = (datum) =>
        `${getInteractionPrimary(datum)}_${datum.secondaryValue}`;
    }

    allDatums.forEach((datum) => {
      const interactionKey = getInteractionKey(datum);

      if (!datumsByInteractionGroup.has(interactionKey)) {
        datumsByInteractionGroup.set(interactionKey, []);
      }


      datumsByInteractionGroup.get(interactionKey).push(datum);
    });

    datumsByInteractionGroup.forEach((value, key) => {
      datumsByInteractionGroup.set(
        key,
        sortDatumsBySecondaryPx(value, secondaryAxes)
      );
    });

    allDatums.forEach((datum) => {
      const interactionKey = getInteractionKey(datum);

      datum.interactiveGroup = datumsByInteractionGroup.get(interactionKey);
    });

    return [datumsByInteractionGroup];
  }, [
    allDatums,
    options.interactionMode,
    primaryAxis,
    secondaryAxes,
  ]);

  const getSeriesStatusStyle = useCallback(
    (series, focusedDatum) => {
      const base = {
        color:
          getOptions().defaultColors[
            series.index % getOptions().defaultColors.length
          ],
      };

      const status = getSeriesStatus(
        series,
        focusedDatum,
        options.groupedIndexes
      );
      const statusStyles = getOptions().getSeriesStyle?.(series, status) ?? {};
      series.style = materializeStyles(statusStyles, base);
      return series.style;
    },
    [getOptions, options.groupedIndexes]
  );

  const getDatumStatusStyle = useCallback(
    (datum, focusedDatum) => {
      const base = {
        ...series[datum.seriesIndex]?.style,
        color:
          getOptions().defaultColors[
            datum.seriesIndex % getOptions().defaultColors.length
          ],
      };

      const status = getDatumStatus(datum, focusedDatum);
      const statusStyles = getOptions().getDatumStyle?.(datum, status) ?? {};

      datum.style = materializeStyles(statusStyles, base);

      return datum.style;
    },
    [getOptions, series]
  );

  let orderedSeries = useMemo(() => {
    const reversedSeries = [...series].reverse();

    return getOptions().getSeriesOrder(reversedSeries);
  }, [getOptions, series]);

  useIsomorphicLayoutEffect(() => {
    if (
      svgRef.current &&
      svgRef.current.parentElement &&
      !svgRef.current.parentElement.style.position
    ) {
      svgRef.current.parentElement.style.position = "relative";
    }
  });

  const contextValue = {
    getOptions,
    gridDimensions,
    primaryAxis,
    secondaryAxes,
    series,
    orderedSeries,
    datumsByInteractionGroup,
    datumsByTooltipGroup,
    width,
    height,
    getSeriesStatusStyle,
    getDatumStatusStyle,
    axisDimensionsState,
    focusedDatumState,
    svgRef,
  };

  const seriesByAxisId = useMemo(
    () =>
      sort(
        groups(orderedSeries, (d) => d.secondaryAxisId),
        ([key]) => secondaryAxes.findIndex((axis) => axis.id === key)
      ),
    [orderedSeries, secondaryAxes]
  );

  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // let getSeriesInfo = () => ({
  //   primaryAxis,
  //   secondaryAxes,
  //   seriesByAxisId,
  // });

  // let getMemoizedSeriesInfo = useCallback(
  //   () => ({
  //     primaryAxis,
  //     secondaryAxes,
  //     seriesByAxisId,
  //   }),
  //   [primaryAxis, secondaryAxes, seriesByAxisId]
  // );

  // if (options.memoizeSeries) {
  //   getSeriesInfo = getMemoizedSeriesInfo;
  // }

  // const seriesEl = useMemo(() => {
  //   const { primaryAxis, secondaryAxes, seriesByAxisId } = getSeriesInfo();
  //   console.log("seriesByAxisId: ", seriesByAxisId);
  //   return seriesByAxisId.map(([axisId, series]) => {
  //     console.log("axisId: ", axisId);
  //     const secondaryAxis = secondaryAxes.find((d) => d.id === axisId);
  //     console.log("secondaryAxis: ", secondaryAxis);
  //     console.log("secondaryAxes: ", secondaryAxes);

  //     if (!secondaryAxis) {
  //       return null;
  //     }

  //     const { elementType } = secondaryAxis;
  //     const Component = (() => {
  //       if (
  //         elementType === "line" ||
  //         elementType === "bubble" ||
  //         elementType === "area"
  //       ) {
  //         return Line;
  //       }
  //       // if (elementType === "bar") {
  //       //   return Bar;
  //       // }
  //       throw new Error("Invalid elementType");
  //     })();

  //     if (primaryAxis.isInvalid || secondaryAxis.isInvalid) {
  //       return null;
  //     }

  //     // const deferredSeries = useDeferredValue(series, { timeoutMs: 3000 });
  //     // const isDeferred = series !== deferredSeries;

  //     // console.log("isDeferred: ", isDeferred);

  //     return (
  //       // <Suspense fallback={<text>loader</text>}>
  //       <Component
  //         key={axisId ?? "__default__"}
  //         primaryAxis={primaryAxis}
  //         secondaryAxis={secondaryAxis}
  //         // series={deferredSeries}
  //         series={series}
  //       />
  //       // </Suspense>
  //     );
  //   });
  // }, [getSeriesInfo]);

  // const deferredSeriesEl = useDeferredValue(seriesEl, { timeoutMs: 1000 });
  // const isDeferred = seriesEl !== deferredSeriesEl;

  // console.log("isDeferred: ", isDeferred);

  // console.log("seriesEl: ", seriesEl);

  return (
    <ChartContextProvider value={useGetLatest(contextValue)}>
      <div>
        <svg
          ref={svgRef}
          style={{
            width,
            height,
            overflow: options.brush ? "hidden" : "visible",
          }}
          onClick={(e) => options.onClickDatum?.(focusedDatum, e)}
        >
          <g className="axes">
            {[primaryAxis, ...secondaryAxes].map((axis) => (
              <AxisLinear key={[axis.position, axis.id].join("")} {...axis} />
            ))}
          </g>
          <g
            className="Series"
            style={{
              pointerEvents: "none",
            }}
          >
            {/* {isAxisDemensionsReady && !isDeferred && deferredSeriesEl} */}
            {isAxisDemensionsReady && (
              <SeriesEl
                primaryAxis={primaryAxis}
                secondaryAxes={secondaryAxes}
                seriesByAxisId={seriesByAxisId}
              />
            )}
            {/* {isAxisDemensionsReady && seriesEl} */}
          </g>
          {isAxisDemensionsReady && <Voronoi />}
          {options.renderSVG?.() ?? null}
        </svg>
        <Cursors />
        <Tooltip />
      </div>
    </ChartContextProvider>
  );
};

const SeriesEl = ({ primaryAxis, secondaryAxes, seriesByAxisId }) => {
  const components = useMemo(
    () =>
      seriesByAxisId.map(([axisId, series]) => {
        const secondaryAxis = secondaryAxes.find((d) => d.id === axisId);

        if (!secondaryAxis) {
          return null;
        }

        const { elementType } = secondaryAxis;
        const Component = (() => {
          if (
            elementType === "line" ||
            elementType === "bubble" ||
            elementType === "area"
          ) {
            return Line;
          }
          // if (elementType === "bar") {
          //   return Bar;
          // }
          throw new Error("Invalid elementType");
        })();

        if (primaryAxis.isInvalid || secondaryAxis.isInvalid) {
          return null;
        }

        return {
          component: Component,
          primaryAxis,
          secondaryAxis,
          series,
        };
      }),
    [primaryAxis, secondaryAxes, seriesByAxisId]
  );

  const deferredCmp = useDeferredValue(components, { timeoutMs: 1000 });
  // const isDeferredCmps = components !== deferredCmp;
  return deferredCmp.map(
    ({ component: Component, ...componentProps }, componentIdx) => (
      <Component key={componentIdx} {...componentProps} />
    )
  );
};

const getFirstDefinedValue = (options, data) => {
  let firstDefinedValue;

  data.some((serie) => {
    // eslint-disable-next-line array-callback-return
    return serie.data.some((originalDatum) => {
      const value = options.getValue(originalDatum);
      if (value !== null && typeof value !== "undefined") {
        firstDefinedValue = value;
        return true;
      }
    });
  });

  return firstDefinedValue;
};

const axisOptionsWithScaleType = (options, firstValue) => {
  let scaleType = options.scaleType;

  if (!options.scaleType) {
    if (typeof firstValue === "number") {
      scaleType = "linear";
    } else if (typeof firstValue?.getMonth === "function") {
      scaleType = "time";
    } else if (
      typeof firstValue === "string" ||
      typeof firstValue === "boolean"
    ) {
      scaleType = "band";
    } else {
      throw new Error("Invalid scale type: Unable to infer type from data");
    }
  }

  return { ...options, scaleType };
};

const sortDatumsBySecondaryPx = (datums, secondaryAxes) => {
  return [...datums].sort((a, b) => {
    const aAxis = secondaryAxes.find((d) => d.id === a.secondaryAxisId);
    const bAxis = secondaryAxes.find((d) => d.id === b.secondaryAxisId);

    const aPx =
      aAxis?.scale(aAxis.stacked ? a.stackData?.[1] : a.secondaryValue) ?? NaN;

    const bPx =
      bAxis?.scale(bAxis.stacked ? b.stackData?.[1] : b.secondaryValue) ?? NaN;

    return aPx - bPx;
  });
};
