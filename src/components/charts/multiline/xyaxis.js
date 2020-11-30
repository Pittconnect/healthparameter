import React from "react";
import Axis from "./axis";
import Text from "./text";

const XYAxis = ({
  xScale,
  yScale,
  xTicks,
  yTicks,
  xText,
  yText,
  xTextSize,
  yTextSize,
  width,
  height,
  margin,
}) => {
  const xSettings = {
    scale: xScale,
    orient: "bottom",
    transform: `translate(0, ${height})`,
    ticks: xTicks,
    tickSize: -height,
    text: xText,
    textSize: xTextSize,
    textTransform: `translate(${(width + margin.right) / 2}, ${
      height + (margin.bottom + xTextSize) / 2
    })`,
  };
  const ySettings = {
    scale: yScale,
    orient: "left",
    transform: "translate(0, 0)",
    ticks: yTicks,
    tickSize: -width,
  };
  const xTextSettings = {
    orient: "bottom",
    text: xText,
    textSize: xTextSize,
    textTransform: `translate(${(width + margin.right) / 2}, ${
      height + (margin.bottom + xTextSize) / 2
    })`,
  };
  const yTextSettings = {
    orient: "left",
    text: yText,
    textSize: yTextSize,
    textTransform: `rotate(-90)`,
    yText: -margin.left + yTextSize / 2,
    xText: -height / 2,
    dyText: ".75em",
  };
  return (
    <g className="axis-group">
      <Axis {...xSettings} />
      <Text {...xTextSettings} />
      <Axis {...ySettings} />
      <Text {...yTextSettings} />
    </g>
  );
};

export default XYAxis;
