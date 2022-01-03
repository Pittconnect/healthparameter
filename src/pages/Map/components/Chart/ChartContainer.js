import React from "react";

import MultilineChart from "./MultilineChart";

import "./ChartContainer.scss";

const ChartContainer = ({ axisHeader, data }) => {
  return (
    <div className="chart-container uk-height-1-1 uk-flex uk-text-center">
      <div className="axis-v-container">
        <span className="axis-v uk-width-auto">{axisHeader.left}</span>
      </div>
      <div className="uk-grid-collapse uk-flex-column uk-flex-1" uk-grid="">
        <div className="uk-width-1-1 axis-h uk-flex uk-flex-center uk-flex-middle">
          {axisHeader.top}
        </div>
        <div className="uk-width-expand uk-flex-1">
          <MultilineChart data={data} />
        </div>
        <div className="uk-width-1-1 axis-h uk-flex uk-flex-center uk-flex-middle">
          {axisHeader.bottom}
        </div>
      </div>
    </div>
  );
};

export default ChartContainer;
