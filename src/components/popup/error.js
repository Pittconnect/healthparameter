import React from "react";

import "./index.scss";

export const ErrorPopup = () => {
  return (
    <section className="error-container">
      <div className="error-header">Oops...</div>
      <span>4</span>
      <span>
        <span className="screen-reader-text">0</span>
      </span>
      <span>4</span>
      <div className="error-description">
        <div>Sorry but the chart</div>
        <div>you are looking for cannot be found</div>
        <span role="img" aria-label="sad">
          😭
        </span>
      </div>
    </section>
  );
};
