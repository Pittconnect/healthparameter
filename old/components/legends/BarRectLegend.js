import React from "react";
import Rect from "../charts/GroupedBar/Rect";
import Text from "../charts/GroupedBar/Text";

const RectLegend = ({
  data,
  x,
  y,
  width,
  height,
  fill,
  fontSize,
  fontColor,
  textAnchor,
  dominantBaseline,
}) => {
  return (
    <>
      <Rect x={x} y={y} width={width} height={height} fill={fill} />
      <Text
        translateX={x + 2}
        translateY={y + fontSize}
        textAnchor={textAnchor}
        dominantBaseline={dominantBaseline}
        fill={fontColor}
        fontSize={fontSize}
        text={`${data.key}: ${data.value}`}
      />
    </>
  );
};

export default RectLegend;
