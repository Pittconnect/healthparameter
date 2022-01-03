import React, { useCallback, useMemo, useState } from "react";

import LineChart from "../../../../components/charts/LineChart/LineChart";

const MultilineChart = ({ data }) => {
  const [activeSeries, setActiveSeries] = useState([]);

  const dateAxis = useMemo(
    () => ({
      getValue: (datum) => datum.date.getDate(),
    }),
    []
  );

  const valueAxes = useMemo(
    () => [
      {
        getValue: (datum) => datum.value,
        showDatumElements: false,
      },
    ],
    []
  );

  const getSeriesStyle = useCallback(
    (_, status) => ({
      ...((status === "active" || status === "none") && { opacity: 1 }),
      ...(status === "focused" && { opacity: 0.7, strokeWidth: 4 }),
      ...(status === "inactive" && { opacity: 0.1 }),
    }),
    []
  );

  const onClickDatum = useCallback(
    (datum) => {
      if (!datum) return;

      const { seriesIndex } = datum;

      const activeSeriesIndex = activeSeries.indexOf(seriesIndex);

      if (activeSeriesIndex !== -1) {
        setActiveSeries((series) => [
          ...series.slice(0, activeSeriesIndex),
          ...series.slice(activeSeriesIndex + 1),
        ]);
      } else {
        setActiveSeries((series) => [...series, seriesIndex]);
      }
    },
    [activeSeries]
  );

  return (
    <LineChart
      data={data}
      primaryAxis={dateAxis}
      secondaryAxes={valueAxes}
      memoizeSeries
      onClickDatum={onClickDatum}
      tooltip={{ groupingMode: "primary" }}
      interactionMode="closest"
      groupedIndexes={activeSeries}
      getSeriesStyle={getSeriesStyle}
      padding={{ left: 10, right: 10, top: 5, bottom: 5 }}
      dark
    />
  );
};

export default MultilineChart;
