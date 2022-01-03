import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import ReactMapGL, {
  Source,
  Layer,
  NavigationControl,
  WebMercatorViewport,
} from "react-map-gl";
import mapboxgl from "mapbox-gl";

import { ZOOM, BOUNDS } from "../helpers";
import Spiner from "./spiner/Spiner";
import { countiesLayers } from "../pages/Map/components/Layers/CountyLayers";
import { statesLayers } from "../pages/Map/components/Layers/StateLayers";
import MapPopup from "../pages/Map/components/Popup/Popup";
import ChartContainer from "../pages/Map/components/Chart/ChartContainer";

const TOKEN = process.env.REACT_APP_MAPBOX_ACCESS;
const MAP_STYLE = process.env.REACT_APP_MAPBOX_STYLE;
const COUNTIES_TILESET = process.env.REACT_APP_MAPBOX_COUNTIES_TILESET;
const STATES_TILESET = process.env.REACT_APP_MAPBOX_STATES_TILESET;

mapboxgl.workerClass =
  // eslint-disable-next-line import/no-webpack-loader-syntax
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const Map = ({
  loading,
  initialViewport,
  featureData,
  popupCoordinates,
  updateFeatureData,
  updatePopupCoordinates,
  onMapLoading,
}) => {
  const [viewport, setViewport] = useState({
    latitude: 40.54097864298709,
    longitude: -99.81367290280828,
    zoom: ZOOM.MIN,
    bearing: 0,
    pitch: 0,
  });

  const mapRef = useRef();
  const hoveredStateId = useRef(null);
  const hoveredStateSource = useRef(null);
  const hoveredSourceLayer = useRef(null);

  const onViewStateChange = (viewState) => {
    const { width, height } = viewState;
    const vp = new WebMercatorViewport(viewState);
    const wn = vp.unproject([0, 0]);
    const es = vp.unproject([width, height]);

    if (wn[0] < BOUNDS[0][0]) {
      const leftBoundPx = vp.project(BOUNDS[0]);
      const centerX = vp.unproject([(width - 1) / 2 + leftBoundPx[0], height]);

      viewState.longitude = centerX[0];
    }
    if (wn[1] > BOUNDS[1][1]) {
      const topBoundPx = vp.project(BOUNDS[1]);
      const centerY = vp.unproject([width, (height - 1) / 2 + topBoundPx[1]]);

      viewState.latitude = centerY[1];
    }
    if (es[0] > BOUNDS[1][0]) {
      const rightBoundPx = vp.project(BOUNDS[1]);
      const diff = width - rightBoundPx[0];
      const centerX = vp.unproject([(rightBoundPx[0] - 1 - diff) / 2, height]);

      viewState.longitude = centerX[0];
    }
    if (es[1] < BOUNDS[0][1]) {
      const bottomBoundPx = vp.project(BOUNDS[0]);
      const diff = height - bottomBoundPx[1];
      const centerY = vp.unproject([width, (bottomBoundPx[1] - 1 - diff) / 2]);

      viewState.latitude = centerY[1];
    }

    setViewport({
      ...viewState,
    });
  };

  const onMapClick = ({ features, lngLat }) => {
    if (loading) return;

    const featureSource = viewport.zoom > ZOOM.COUNTIES ? "counties" : "states";
    const [feature] = features.filter(
      (feature) => feature.source === featureSource
    );

    let coordinates;
    if (feature) {
      coordinates = lngLat;
    }

    updateFeatureData(feature);
    updatePopupCoordinates(coordinates);
  };

  const onMouseHover = (event) => {
    if (!loading) {
      const map = mapRef.current.getMap();
      const mapZoom = map.getZoom();
      const hoveredLayer = mapZoom > ZOOM.COUNTIES ? "counties" : "states";
      const { features } = event;

      const hoveredFeature = features.find(
        (f) => f.layer.id === "state-bound" || f.layer.id === "county-bound"
      );

      if (hoveredFeature) {
        if (hoveredStateSource.current) {
          map.setFeatureState(
            {
              source: hoveredStateSource.current,
              sourceLayer: hoveredSourceLayer.current,
              id: hoveredStateId.current,
            },
            { hover: false }
          );
        }

        hoveredStateId.current = hoveredFeature.id;
        hoveredStateSource.current = hoveredFeature.source;
        hoveredSourceLayer.current = hoveredFeature.sourceLayer;

        map.setFeatureState(
          {
            source: hoveredStateSource.current,
            sourceLayer: hoveredSourceLayer.current,
            id: hoveredStateId.current,
          },
          { hover: true }
        );
      } else {
        map.setFeatureState(
          {
            source: hoveredStateSource.current || hoveredLayer,
            sourceLayer: hoveredSourceLayer.current,
            id: hoveredStateId.current,
          },
          { hover: false }
        );

        hoveredStateId.current = null;
        hoveredStateSource.current = null;
      }
    }
  };

  const onInteractionStateChange = useCallback(() => {
    if (!popupCoordinates) return;

    updatePopupCoordinates();
  }, [popupCoordinates, updatePopupCoordinates]);

  useEffect(() => {
    if (!initialViewport) return;

    setViewport({
      ...initialViewport,
    });
  }, [initialViewport]);

  const statesSource = useMemo(
    () => (
      <Source
        id="counties"
        type="vector"
        url={COUNTIES_TILESET}
        promoteId="GEO_ID"
      >
        {countiesLayers.map((layerProps, layerIdx) => (
          <Layer key={layerIdx} {...layerProps} beforeId={"waterway-label"} />
        ))}
      </Source>
    ),
    []
  );

  const countiesSource = useMemo(
    () => (
      <Source id="states" type="vector" url={STATES_TILESET} promoteId="GEO_ID">
        {statesLayers.map((layerProps, layerIdx) => (
          <Layer key={layerIdx} {...layerProps} beforeId={"waterway-label"} />
        ))}
      </Source>
    ),
    []
  );

  return (
    <div className="map-container">
      {loading && (
        <div className="map-spinner">
          <Spiner />
        </div>
      )}

      <ReactMapGL
        {...viewport}
        ref={mapRef}
        width="100vw"
        height="100vh"
        mapboxApiAccessToken={TOKEN}
        mapStyle={MAP_STYLE}
        onLoad={onMapLoading}
        onViewportChange={onViewStateChange}
        onHover={onMouseHover}
        onClick={onMapClick}
        onInteractionStateChange={onInteractionStateChange}
        minZoom={ZOOM.MIN}
        maxZoom={ZOOM.MAX}
        attributionControl={false}
        dragRotate={false}
        touchRotate={false}
        scrollZoom={{
          smooth: true,
          speed: 0.01,
        }}
        transitionDuration={0}
      >
        <MapPopup coordinates={popupCoordinates}>
          <ChartContainer
            axisHeader={{
              left: "Daily changes",
              top: `Daily changes in Covid-19 confirmations, ${featureData?.name}`,
              bottom: "Date",
            }}
            data={featureData?.data}
          />
        </MapPopup>

        {statesSource}
        {countiesSource}

        <NavigationControl className="map-navigation" showCompass={false} />
      </ReactMapGL>
    </div>
  );
};

export default Map;
