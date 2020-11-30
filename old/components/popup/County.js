import React from "react";
import GroupedBar from "../charts/GroupedBar/GroupedBar";

const County = ({
  chartHeaders = [{ key: "null", value: "null" }],
  chartData,
}) => {
  const svgWidth = 360;
  const svgHeight = 140;

  return (
    <>
      {chartHeaders.map((header, key) => (
        <h1
          className="chart-header"
          key={key}
        >{`${header.key}: ${header.value}`}</h1>
      ))}
      {chartData.length !== 0 ? (
        <GroupedBar
          width={svgWidth}
          height={svgHeight}
          data={chartData}
          top={10}
          right={10}
          bottom={10}
          left={10}
          showLegend={true}
          legendData={["Max RSEI", "County RSEI"]}
        />
      ) : (
        <h1 className="chart-header" style={{ paddingTop: "10px" }}>
          RSEI Score: NO DATA
        </h1>
      )}
    </>
  );
};

export default County;
