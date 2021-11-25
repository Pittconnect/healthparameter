import React from "react";
import clsx from "clsx";

const LoadingOverlay = ({ loading, loadingText }) => (
  <div
    className={clsx(
      "uk-overlay uk-overlay-primary uk-position-cover uk-position-z-index",
      {
        "uk-hidden": !loading,
      }
    )}
  >
    <div
      className="uk-grid uk-grid-column-collapse uk-grid-row-medium uk-text-center uk-child-width-1-1 uk-position-center uk-text-secondary"
      uk-grid=""
    >
      <span uk-spinner="ratio: 2.5" />
      <span
        className={clsx("uk-margin-small uk-text-large uk-text-bold", {
          "uk-hidden": !loadingText,
        })}
      >
        {loadingText}
      </span>
    </div>
  </div>
);

export default LoadingOverlay;
