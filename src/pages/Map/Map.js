import React from "react";

import Map from "../../components/Map";
import { useMapData } from "./hooks/useMapData";

const MapPage = () => {
  const { viewport } = useMapData();

  return (
    <div className="map-container">
      <Map initialViewport={viewport} />
    </div>
  );
};

export default MapPage;
