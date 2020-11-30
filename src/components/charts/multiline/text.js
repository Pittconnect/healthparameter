import React, { useEffect, useRef } from "react";

const d3 = window.d3;

export default ({
  className,
  orient,
  text,
  yText,
  xText,
  dyText,
  textTransform,
  textSize,
}) => {
  const textRef = useRef({});

  useEffect(() => {
    const textNode = textRef.current;

    if (orient === "bottom") {
      d3.select(textNode).text(text);
    }
    if (orient === "left") {
      d3.select(textNode)
        .attr("y", yText)
        .attr("x", xText)
        .attr("dy", dyText)
        .text(text);
    }
  }, [orient, text, yText, xText, dyText]);

  return (
    <text
      ref={textRef}
      transform={textTransform}
      fontSize={textSize}
      className={`${orient} ${className || "text-label"}`}
    />
  );
};
