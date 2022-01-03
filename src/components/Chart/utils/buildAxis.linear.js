import { extent, max, median, min, range as d3Range } from "d3-array";
import { stack, stackOffsetNone } from "d3-shape";
import {
  scaleLinear,
  scaleLog,
  scaleTime,
  scaleUtc,
  scaleBand,
  // ScaleTime,
  // ScaleLinear,
  // ScaleBand,
} from "d3-scale";

const defaultAxisOptions = (options) => {
  return {
    ...options,
    elementType: options.elementType ?? "line",
    minTickPaddingForRotation: options.minTickPaddingForRotation ?? 10,
    tickLabelRotationDeg: options.tickLabelRotationDeg ?? 60,
    innerBandPadding: options.innerBandPadding ?? 0.5,
    outerBandPadding: options.outerBandPadding ?? 0.2,
    innerSeriesBandPadding: options.innerSeriesBandPadding ?? 0.2,
    outerSeriesBandPadding: options.outerSeriesBandPadding ?? 0,
    show: options.show ?? true,
    stacked: options.stacked ?? false,
    shouldNice: options.shouldNice ?? true,
  };
};

export const buildAxisLinear = (
  isPrimary,
  userOptions,
  series,
  allDatums,
  gridDimensions,
  width,
  height
) => {
  const options = defaultAxisOptions(userOptions);

  if (!options.position) {
    throw new Error(`Chart axes must have a valid 'position' property`);
  }

  const isVertical = ["left", "right"].indexOf(options.position) > -1;

  const range = isVertical
    ? [gridDimensions.height, 0]
    : [0, gridDimensions.width];

  const outerRange = isVertical ? [height, 0] : [0, width];

  return options.scaleType === "time" || options.scaleType === "localTime"
    ? buildTimeAxis(
        isPrimary,
        options,
        series,
        allDatums,
        isVertical,
        range,
        outerRange
      )
    : options.scaleType === "linear" || options.scaleType === "log"
    ? buildLinearAxis(
        isPrimary,
        options,
        series,
        allDatums,
        isVertical,
        range,
        outerRange
      )
    : (() => {
        throw new Error("Invalid scale type");
      })();
};

const buildTimeAxis = (
  isPrimary,
  options,
  series,
  allDatums,
  isVertical,
  range,
  outerRange
) => {
  const scaleFn = options.scaleType === "localTime" ? scaleTime : scaleUtc;

  let isInvalid = false;

  // Now set the range
  const scale = scaleFn(range);

  let [minValue, maxValue] = extent(allDatums, (datum) => {
    const value = options.getValue(datum.originalDatum);
    datum[isPrimary ? "primaryValue" : "secondaryValue"] = value;
    return value;
  });

  let shouldNice = options.shouldNice;

  // see https://stackoverflow.com/a/2831422
  if (Object.prototype.toString.call(options.min) === "[object Date]") {
    minValue = min([options.min, minValue]);
    shouldNice = false;
  }

  if (Object.prototype.toString.call(options.max) === "[object Date]") {
    maxValue = max([options.max, maxValue]);
    shouldNice = false;
  }

  if (Object.prototype.toString.call(options.hardMin) === "[object Date]") {
    minValue = options.hardMin;
    shouldNice = false;
  }

  if (Object.prototype.toString.call(options.hardMax) === "[object Date]") {
    maxValue = options.hardMax;
    shouldNice = false;
  }

  if (minValue === undefined || maxValue === undefined) {
    console.info("Invalid scale min/max was detect for a chart:", {
      options,
      series,
      range,
      values: allDatums.map((d) =>
        isPrimary ? d.primaryValue : d.secondaryValue
      ),
    });
    isInvalid = true;
  }

  // Set the domain
  scale.domain([minValue, maxValue]);

  if (options.invert) {
    scale.domain(Array.from(scale.domain()).reverse());
  }

  if (shouldNice) {
    scale.nice();
  }

  const outerScale = scale.copy().range(outerRange);

  // Supplmentary band scale
  const primaryBandScale = isPrimary
    ? buildPrimaryBandScale(options, scale, series, range)
    : undefined;

  const seriesBandScale = primaryBandScale
    ? buildSeriesBandScale(options, primaryBandScale, series)
    : undefined;

  const defaultFormat = scale.tickFormat();

  const formatters = {};

  const scaleFormat = (value) =>
    options.formatters?.scale?.(value, { ...formatters, scale: undefined }) ??
    defaultFormat(value);

  const tooltipFormat = (value) =>
    options.formatters?.tooltip?.(value, {
      ...formatters,
      tooltip: undefined,
    }) ?? scaleFormat(value);

  const cursorFormat = (value) =>
    options.formatters?.cursor?.(value, { ...formatters, cursor: undefined }) ??
    tooltipFormat(value);

  Object.assign(formatters, {
    default: defaultFormat,
    scale: scaleFormat,
    tooltip: tooltipFormat,
    cursor: cursorFormat,
  });

  return {
    ...options,
    isInvalid,
    axisFamily: "time",
    isVertical,
    scale,
    range,
    outerScale,
    primaryBandScale,
    seriesBandScale,
    formatters: formatters,
  };
};

const buildLinearAxis = (
  isPrimary,
  options,
  series,
  allDatums,
  isVertical,
  range,
  outerRange
) => {
  const scale = options.scaleType === "log" ? scaleLog() : scaleLinear();

  let isInvalid = false;

  if (options.stacked) {
    stackSeries(series, options);
  }

  let [minValue, maxValue] = options.stacked
    ? extent(
        series
          .map((s) =>
            s.datums.map((datum) => {
              const value = options.getValue(datum.originalDatum);
              datum[isPrimary ? "primaryValue" : "secondaryValue"] = value;

              return datum.stackData ?? [];
            })
          )
          .flat(2)
      )
    : extent(allDatums, (datum) => {
        const value = options.getValue(datum.originalDatum);
        datum[isPrimary ? "primaryValue" : "secondaryValue"] = value;
        return value;
      });

  let shouldNice = options.shouldNice;

  if (typeof options.min === "number") {
    minValue = min([options.min, minValue]);
    shouldNice = false;
  }

  if (typeof options.max === "number") {
    maxValue = max([options.max, maxValue]);
    shouldNice = false;
  }

  if (
    typeof options.minDomainLength === "number" &&
    !(minValue === undefined || maxValue === undefined)
  ) {
    const mid = median([minValue, maxValue]);
    const top = mid + options.minDomainLength / 2;
    const bottom = mid - options.minDomainLength / 2;
    maxValue = Math.max(top, maxValue);
    minValue = Math.min(bottom, minValue);
  }

  if (typeof options.hardMin === "number") {
    minValue = options.hardMin;
    shouldNice = false;
  }

  if (typeof options.hardMax === "number") {
    maxValue = options.hardMax;
    shouldNice = false;
  }

  if (minValue === undefined || maxValue === undefined) {
    isInvalid = true;
    console.info("Invalid scale min/max", {
      options,
      series,
      range,
      values: allDatums.map((d) =>
        isPrimary ? d.primaryValue : d.secondaryValue
      ),
    });
    minValue = minValue ?? 0;
    maxValue = maxValue ?? 0;
    // throw new Error('Invalid scale min/max')
  }

  // Set the domain
  scale.domain([minValue, maxValue]);

  if (options.invert) {
    scale.domain(Array.from(scale.domain()).reverse());
  }

  scale.range(range);

  if (shouldNice) {
    scale.nice();
  }

  const outerScale = scale.copy().range(outerRange);

  const primaryBandScale = isPrimary
    ? buildPrimaryBandScale(options, scale, series, range)
    : undefined;

  const seriesBandScale = primaryBandScale
    ? buildSeriesBandScale(options, primaryBandScale, series)
    : undefined;

  const defaultFormat = scale.tickFormat();

  const formatters = {};

  const scaleFormat = (value) =>
    options.formatters?.scale?.(value, { ...formatters, scale: undefined }) ??
    defaultFormat(value);

  const tooltipFormat = (value) =>
    options.formatters?.tooltip?.(value, {
      ...formatters,
      tooltip: undefined,
    }) ?? scaleFormat(value);

  const cursorFormat = (value) =>
    options.formatters?.cursor?.(value, { ...formatters, cursor: undefined }) ??
    tooltipFormat(value);

  Object.assign(formatters, {
    default: defaultFormat,
    scale: scaleFormat,
    tooltip: tooltipFormat,
    cursor: cursorFormat,
  });

  return {
    ...options,
    isInvalid,
    axisFamily: "linear",
    isVertical,
    scale,
    range,
    outerScale,
    primaryBandScale,
    seriesBandScale,
    formatters,
  };
};

const stackSeries = (series, axisOptions) => {
  const axisSeries = series.filter((s) => s.secondaryAxisId === axisOptions.id);
  const seriesIndices = Object.keys(axisSeries);
  const stacker = stack()
    .keys(seriesIndices)
    .value((_, seriesIndex, index) => {
      const originalDatum =
        axisSeries[Number(seriesIndex)]?.datums[index]?.originalDatum;

      const val =
        typeof originalDatum !== "undefined"
          ? axisOptions.getValue(originalDatum)
          : 0;

      if (typeof val === "undefined" || val === null) {
        return 0;
      }

      return val;
    })
    .offset(axisOptions.stackOffset ?? stackOffsetNone);

  const stacked = stacker(
    Array.from({
      length: axisSeries.sort((a, b) => b.datums.length - a.datums.length)[0]
        .datums.length,
    })
  );

  stacked.forEach((s, sIndex) => {
    s.forEach((datum, i) => {
      if (axisSeries[sIndex].datums[i]) {
        datum.data = axisSeries[sIndex].datums[i];

        axisSeries[sIndex].datums[i].stackData = datum;
      }
    });
  });
};

const buildPrimaryBandScale = (options, scale, series, range) => {
  // Find the two closest points along axis
  let impliedBandWidth = Math.max(...range);

  series.forEach((serie) => {
    serie.datums.forEach((d1) => {
      const one = scale(d1.primaryValue ?? NaN);

      serie.datums.forEach((d2) => {
        const two = scale(d2.primaryValue ?? NaN);

        if (one === two) {
          return;
        }

        const diff = Math.abs(Math.max(one, two) - Math.min(one, two));

        if (diff < impliedBandWidth) {
          impliedBandWidth = diff;
        }
      });
    });
  });

  const bandRange = Math.max(...range);

  const bandDomain = d3Range(bandRange / impliedBandWidth);

  const primaryBandScale = scaleBand(bandDomain, range)
    .round(false)
    .paddingOuter(options.outerBandPadding ?? 0)
    .paddingInner(options.innerBandPadding ?? 0);

  return primaryBandScale;
};

const buildSeriesBandScale = (options, primaryBandScale, series) => {
  const bandDomain = d3Range(
    series.filter((d) => d.secondaryAxisId === options.id).length
  );

  const seriesBandScale = scaleBand(bandDomain, [
    0,
    primaryBandScale.bandwidth(),
  ])
    .round(false)
    .paddingOuter(
      options.outerSeriesBandPadding ??
        (options.outerBandPadding ? options.outerBandPadding / 2 : 0)
    )
    .paddingInner(
      options.innerSeriesBandPadding ??
        (options.innerBandPadding ? options.innerBandPadding / 2 : 0)
    );

  const scale = (seriesIndex) =>
    seriesBandScale(series.find((d) => d.index === seriesIndex)?.indexPerAxis);

  return Object.assign(scale, seriesBandScale);
};
