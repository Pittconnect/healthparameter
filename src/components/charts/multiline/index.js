import React, { memo } from "react";
import { union } from "d3-array";

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
    const legendWidth =
      width / (7 + data.length) - legendMargins.left - legendMargins.right;
    const chartWidth =
      width - legendWidth * data.length - margins.left - margins.right;
    const chartHeight = height - margins.top - margins.bottom;

    const xScale = d3.scaleLinear().domain([-1, 33]).range([0, chartWidth]);
    const yScale = d3
      .scaleLinear()
      .domain(
        d3.extent(
          d3.merge(d3.merge(data.map((d) => d.values)).map((d) => d.values)),
          (d) => d.cases
        )
      )
      .range([chartHeight, 0]);

    const lineGenerator = d3
      .line()
      .x((d) => xScale(+d.date.split("/")[1]))
      .y((d) => yScale(d.cases));

    const lineNames = union(
      ...data.map((d) => [...d.values.map((_d) => _d.key)])
    );

    const yearColor = d3
      .scaleLinear()
      .domain(d3.ticks(0, data.length, data.length))
      .range(MULTILINE_COLORS);

    const lineColor = (year) =>
      d3
        .scaleLinear()
        .domain([-4, lineNames.size])
        .range(["white", yearColor(year)]);

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
          {data.map((item, index) => (
            <React.Fragment key={index}>
              <g className="line-group">
                {item.values.map((lineData, lineKey) => (
                  <React.Fragment key={lineKey}>
                    <Line
                      data={lineData.values}
                      lineGenerator={lineGenerator}
                      color={lineColor(index)(lineKey)}
                    />
                    <g className="circles-group">
                      {lineData.values.map((lineDataV, lineDataI) => (
                        <Circle
                          key={lineDataI}
                          cx={xScale(+lineDataV.date.split("/")[1])}
                          cy={yScale(lineDataV.cases)}
                          color={lineColor(index)(lineKey)}
                        />
                      ))}
                    </g>
                  </React.Fragment>
                ))}
              </g>
              <Legend
                key={index}
                header={item.key}
                data={item.values.map((d) => d.key)}
                width={legendWidth}
                height={chartHeight}
                color={lineColor(index)}
                textSize={14}
                transform={`translate(${
                  chartWidth + legendWidth * index + legendMargins.left
                }, ${legendMargins.top})`}
              />
            </React.Fragment>
          ))}
        </g>
      </svg>
    );
  },
  (prev, next) => {
    return prev.data === next.data;
  }
);
