import React, { useEffect, useRef } from "react";

const d3 = window.d3;

export default ({
  data,
  header,
  width,
  height,
  textSize,
  transform,
  color,
}) => {
  const legendRef = useRef({});

  useEffect(() => {
    const legendNode = legendRef.current;
    const paddings = { left: 10, top: 20, right: 10, };

    const lineData = d3
      .nest()
      .key((d) => d[0])
      .entries(d3.cross(data, [0, 1, 2]));

    const xScale = d3
      .scaleLinear()
      .domain([0, 2])
      .range([0, (width - paddings.left - paddings.right) / 2]);

    const yScale = d3
      .scaleBand()
      .range([paddings.top, (3 * textSize * data.length) / 2])
      .domain(data);

    const line = d3
      .line()
      .x((d) => xScale(d[1]))
      .y((d) => yScale(d[0]));

    d3.select(legendNode)
      .selectAll(".legend-header")
      .data([header], (d) => d)
      .join((enter) =>
        enter
          .append("text")
          .attr("class", "legend-header")
          .attr("x", width / 2.5)
          .attr("y", 0)
          .text((d) => d)
          .style("font-size", textSize)
          .attr("text-anchor", "middle")
          .style("alignment-baseline", "middle")
      );

    d3.select(legendNode)
      .selectAll("circle")
      .data(data, (d) => d)
      .join((enter) => {
        enter
          .append("circle")
          .attr("cx", xScale(1))
          .attr("cy", (d) => yScale(d))
          .attr("r", 3)
          .attr("fill", (_, i) => color(i));
      });

    d3.select(legendNode)
      .selectAll("path")
      .data(lineData, (d) => d)
      .join((enter) =>
        enter
          .append("path")
          .attr("d", (d) => line(d.values))
          .attr("stroke-width", 2)
          .attr("stroke", (_, i) => color(i))
      );

    d3.select(legendNode)
      .selectAll(".legend-item")
      .data(data, (d) => d)
      .join((enter) =>
        enter
          .append("text")
          .attr("class", "legend-item")
          .attr("x", width / 2)
          .attr("y", (d) => yScale(d))
          .text((d) => d)
          .style("font-size", textSize)
          .attr("text-anchor", "start")
          .style("alignment-baseline", "middle")
      );
  }, [color, data, textSize, height, header, width]);

  return <g ref={legendRef} className="legend-group" transform={transform} />;
};
