import React from "react";
import { Popup } from "react-map-gl";

import "./Popup.scss";

const MapPopup = ({ coordinates, children }) => {
  if (!coordinates) {
    return null;
  }

  return (
    <Popup
      latitude={coordinates?.latitude}
      longitude={coordinates?.longitude}
      dynamicPosition={true}
      closeButton={false}
    >
      <div className="popup-container overflow-auto">
        <div className="popup-chart uk-background-secondary overflow-auto uk-border-rounded">
          {children}
        </div>
      </div>
    </Popup>
  );
};

export default MapPopup;
