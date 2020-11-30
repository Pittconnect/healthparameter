import React from "react";
import Rect from "./Rect";
import Text from "./Text";
import RectLegend from "../../legends/BarRectLegend";
import { GROUPED_BAR_COLORS } from "../../../helpers";

const d3 = window.d3;

const GroupedBar = ({
  width,
  height,
  top,
  right,
  bottom,
  left,
  data,
  showLegend,
  legendData,
  showPercentage = true,
}) => {
  const contentWidth = width - left - right;
  const contentHeight = height - top - bottom;
  const legendHeight = contentHeight / 3;
  const chartHeight = contentHeight - legendHeight;

  const colorScale = d3
    .scaleOrdinal()
    .domain(data.map((d, i) => i))
    .range(GROUPED_BAR_COLORS);

  const x = d3
    .scaleLinear()
    .domain([0, d3.max(data)])
    .range([0, contentWidth]);
  const y = d3
    .scaleBand()
    .range([0, chartHeight])
    .domain(data.map((d, i) => i))
    .padding(0.1);

  const legColorScale = d3
    .scaleOrdinal()
    .domain(legendData)
    .range(GROUPED_BAR_COLORS);

  const legX = d3
    .scaleBand()
    .range([0, contentWidth])
    .domain(legendData)
    .paddingInner(0.1);

  const format = d3.format(".2f");
  const chartFontSize = 12;

  const _translateX = (x) => {
    const leftPos = chartFontSize * 3 + 2;
    return x < leftPos ? leftPos : x;
  };

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${left}, ${top})`}>
        {data.map((d, i) => (
          <React.Fragment key={i}>
            <Rect
              key={i}
              x={x(0)}
              y={y(i)}
              width={x(d)}
              height={y.bandwidth()}
              fill={colorScale(i)}
            />
            {showPercentage && (
              <Text
                translateX={_translateX(x(d) - 2)}
                translateY={y(i) + y.bandwidth() / 2}
                textAnchor={"end"}
                dominantBaseline="middle"
                fill={"#fff"}
                fontSize={chartFontSize}
                text={`${format((d * 100) / d3.max(data))}%`}
              />
            )}
          </React.Fragment>
        ))}
        {showLegend &&
          legendData.map((d, i) => (
            <RectLegend
              key={i}
              data={{ key: d, value: data[i] }}
              x={legX(d)}
              y={chartHeight + bottom}
              width={legX.bandwidth()}
              height={legendHeight - bottom}
              fill={legColorScale(d)}
              fontSize={15}
              fontColor={"#fff"}
              textAnchor={"start"}
              dominantBaseline="middle"
            />
          ))}
      </g>
    </svg>
  );
};

export default GroupedBar;
