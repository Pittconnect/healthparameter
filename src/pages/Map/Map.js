import React, { useCallback } from "react";

import Map from "../../components/Map";
import { useMapData } from "./state/hooks/useMapData";

const MapPage = () => {
  const {
    isLoading,
    viewport,
    featureData,
    popupCoordinates,

    updateFeatureData,
    updatePopupCoordinates,
    onMapLoading,
  } = useMapData();

  const onChangeMapData = useCallback(
    (feature) => {
      if (!feature) return;

      updateFeatureData(feature);
    },
    [updateFeatureData]
  );

  const onChangePopup = useCallback(
    (coordinates) => {
      updatePopupCoordinates(coordinates);
    },
    [updatePopupCoordinates]
  );

  return (
    <div className="map-container">
      <Map
        loading={isLoading}
        initialViewport={viewport}
        featureData={featureData}
        popupCoordinates={popupCoordinates}
        updateFeatureData={onChangeMapData}
        updatePopupCoordinates={onChangePopup}
        onMapLoading={onMapLoading}
      />
    </div>
  );
};

export default MapPage;
