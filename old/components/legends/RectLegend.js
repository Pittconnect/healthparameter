import React, { useState, useEffect } from "react";
import Text from "../charts/GroupedBar/Text";

const getCoord = (containerWidth, elementWidth, index) => {
  const columnsCount = Math.trunc(containerWidth / elementWidth);

  const getX = () => {
    const column = index % columnsCount;
    const elWidth = containerWidth / columnsCount;
    const wDiff = elWidth - elementWidth;
    const offset = wDiff / 2;

    const x = (elementWidth + wDiff) * column + offset;

    return x;
  };

  const getY = (containerHeight, elementHeight, paddingTop, paddingBottom) => {
    const paddingVertical = paddingTop + paddingBottom;
    const rowsCount = Math.trunc(
      containerHeight / (elementHeight + paddingVertical)
    );
    const row = Math.trunc(index / columnsCount);
    const elHeight = containerHeight / rowsCount;
    const hDiff = elHeight - elementHeight;
    const offset = hDiff / 2;

    const y = (elementHeight + hDiff) * row + offset;

    return y;
  };

  return { getX, getY };
};

const RectLegend = ({
  containerWidth,
  containerHeight,
  elementWidth,
  elementHeight,
  paddingTop,
  paddingBottom,
  elementLabel,
  elementFontSize,
  elementIndex,
  colorScale,
}) => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    setX(getCoord(containerWidth, elementWidth, elementIndex).getX());
    setY(
      getCoord(containerWidth, elementWidth, elementIndex).getY(
        containerHeight,
        elementHeight,
        paddingTop,
        paddingBottom
      )
    );
  }, [
    containerWidth,
    containerHeight,
    elementWidth,
    elementHeight,
    elementIndex,
    paddingTop,
    paddingBottom,
  ]);

  return (
    <>
      <rect
        width={elementWidth}
        height={elementHeight}
        fill={colorScale(elementLabel)}
        x={x}
        y={y}
      />
      <Text
        translateX={x + 2}
        translateY={y + elementFontSize + 2}
        textAnchor={"start"}
        dominantBaseline={"baseline"}
        fill={"#fff"}
        fontSize={elementFontSize}
        text={elementLabel}
      />
    </>
  );
};

export default RectLegend;
