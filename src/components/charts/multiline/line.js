import React, { useEffect, useRef } from "react";

const d3 = window.d3;

export default ({ data, lineGenerator, color }) => {
  const lineRef = useRef({});

  useEffect(() => {
    const lineNode = lineRef.current;

    d3.select(lineNode).datum(data).attr("d", lineGenerator);
  }, [data, lineGenerator]);

  return <path ref={lineRef} stroke={color} strokeWidth="2" fill="none" />;
};
