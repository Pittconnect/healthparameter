import React, { useEffect, useRef } from "react";

const d3 = window.d3;

const Axis = ({ orient, transform, scale, ticks, tickSize }) => {
  const axisRef = useRef({});

  useEffect(() => {
    const renderAxis = () => {
      const axisNode = axisRef.current;
      let axis;

      if (orient === "bottom") {
        axis = d3.axisBottom(scale).ticks(ticks).tickSize(tickSize);
      }
      if (orient === "left") {
        axis = d3.axisLeft(scale).ticks(ticks).tickSize(tickSize);
      }
      d3.select(axisNode).call(axis);
    };

    renderAxis();
  }, [orient, scale, ticks, tickSize]);

  return <g ref={axisRef} transform={transform} className={`${orient} axis`} />;
};

export default Axis;
