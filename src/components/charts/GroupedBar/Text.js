import React from "react";

const Text = ({
  translateX,
  translateY,
  textAnchor,
  dominantBaseline,
  fill,
  fontSize,
  text,
}) => {
  return (
    <text
      transform={`translate(${translateX}, ${translateY})`}
      textAnchor={textAnchor}
      dominantBaseline={dominantBaseline}
      fill={fill}
      fontSize={fontSize}
    >
      {text}
    </text>
  );
};

export default Text;
