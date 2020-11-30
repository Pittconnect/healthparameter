import React, { memo } from "react";

import Text from "./text";
import XYAxis from "./xyaxis";
import Line from "./line";
import Circle from "./circle";
import Legend from "./legend";

import { MULTILINE_COLORS } from "../../../helpers";

import "./index.scss";

const d3 = window.d3;

export default memo(
  ({
    data,
    header,
    xAxisLabel,
    yAxisLabel,
    xAxisTicks,
    yAxisTicks,
    width,
    height,
    margins,
    legendMargins,
  }) => {
    const legendWidth = width / 5 - legendMargins.left - legendMargins.right;
    const chartWidth = width - legendWidth - margins.left - margins.right;
    const chartHeight = height - margins.top - margins.bottom;

    const xScale = d3.scaleLinear().domain([-1, 33]).range([0, chartWidth]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(d3.merge(data.map((d) => d.values)), (d) => d.cases))
      .range([chartHeight, 0]);

    const lineGenerator = d3
      .line()
      .x((d) => xScale(+d.date.split("/")[1]))
      .y((d) => yScale(d.cases));

    const lineNames = data.map((d) => d.key);
    const lineColor = d3
      .scaleOrdinal()
      .domain(lineNames)
      .range(MULTILINE_COLORS);

    return (
      <svg className="line-chart-container" width={width} height={height}>
        <Text
          {...{
            className: "header",
            orient: "bottom",
            text: header,
            textSize: margins.top / 2,
            textTransform: `translate(${
              (width - legendWidth + margins.left - margins.right) / 2
            }, ${margins.top / 2})`,
          }}
        />
        <g transform={`translate(${margins.left}, ${margins.top})`}>
          <XYAxis
            {...{
              xScale,
              yScale,
              xTicks: xAxisTicks,
              yTicks: yAxisTicks,
              xText: xAxisLabel,
              yText: yAxisLabel,
              xTextSize: margins.bottom / 2,
              yTextSize: margins.left / 3,
              width: chartWidth,
              height: chartHeight,
              margin: margins,
            }}
          />
          <g className="line-group">
            {data.map((entry, index) => (
              <React.Fragment key={index}>
                <Line
                  data={entry.values}
                  lineGenerator={lineGenerator}
                  color={lineColor(entry.key)}
                />
                <g className="circles-group">
                  {entry.values.map((entryValue, entryIndex) => (
                    <React.Fragment key={entryIndex}>
                      <Circle
                        cx={xScale(+entryValue.date.split("/")[1])}
                        cy={yScale(entryValue.cases)}
                        color={lineColor(entry.key)}
                      />
                    </React.Fragment>
                  ))}
                </g>
              </React.Fragment>
            ))}
          </g>
          <Legend
            data={lineNames}
            width={legendWidth}
            height={chartHeight}
            color={lineColor}
            textSize={14}
            transform={`translate(${chartWidth + legendMargins.left}, ${
              legendMargins.top
            })`}
          />
        </g>
      </svg>
    );
  },
  (prev, next) => {
    return prev.data === next.data;
  }
);
