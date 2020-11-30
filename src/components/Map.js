import React, { useRef, useState, useEffect, useMemo } from "react";
import ReactMapGL, {
  Source,
  Layer,
  Popup,
  NavigationControl,
  WebMercatorViewport,
} from "react-map-gl";
import moment from "moment";
import {
  statesBoundLayer,
  statesBorderLayer,
  countiesBoundLayer,
  countiesBorderLayer,
} from "./Layers";
import Spiner from "./spiner/Spiner";
import MultilineChart from "./charts/multiline";
import { ErrorPopup } from "../components/popup";

import { COVIDTRACKER_API_LINK, ZOOM, BOUNDS } from "../helpers";
import { useFetch } from "../hooks";

const d3 = window.d3;

const TOKEN = process.env.REACT_APP_MAPBOX_ACCESS;

const Map = () => {
  const [viewport, setViewport] = useState({
    latitude: 40.54097864298709,
    longitude: -99.81367290280828,
    zoom: ZOOM.MIN,
    bearing: 0,
    pitch: 0,
  });
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [popupCoords, setPopupCoords] = useState({});
  const [{ data: trackers, isLoading: isTrackersLoading, error }] = useFetch(
    COVIDTRACKER_API_LINK,
    {
      dataFormat: "csv",
      dataParser: d3.csvParse,
    }
  );
  const [selectedState, setSelectedState] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("");
  const [isStateMode, setIsStateMode] = useState(true);
  const [statesInfo, setStatesInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usGeoJsonCounties, setUsGeoJsonCounties] = useState([]);
  const [isCountiesLoading, setIsCountiesLoading] = useState(false);
  const [usGeoJsonStates, setUsGeoJsonStates] = useState([]);
  const [isStatesLoading, setIsStatesLoading] = useState(false);

  const mapRef = useRef();
  const _sourceRef = useRef();
  const hoveredStateId = useRef(null);
  const hoveredStateSource = useRef(null);

  const _onLoad = () => setIsMapLoaded(true);

  const _onViewStateChange = ({ viewState }) => {
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

    if (isMapLoaded) {
      const map = mapRef.current.getMap();
      const mapZoom = map.getZoom();
      if (mapZoom < ZOOM.COUNTIES) {
        setIsStateMode(true);
        setSelectedCounty("");
      } else {
        setIsStateMode(false);
        setSelectedState("");
      }
    }

    setViewport(viewState);
  };

  const _onMouseHover = (event) => {
    if (isMapLoaded) {
      const map = mapRef.current.getMap();
      const mapZoom = map.getZoom();
      const hoveredLayer = mapZoom > ZOOM.COUNTIES ? "counties" : "states";
      const { features, lngLat } = event;

      const hoveredFeature = features.find(
        (f) => f.layer.id === "state-bound" || f.layer.id === "county-bound"
      );
      if (hoveredFeature) {
        const [longitude, latitude] = lngLat;
        setPopupCoords({ longitude, latitude });

        if (mapZoom < ZOOM.COUNTIES) {
          getStateInfo(hoveredFeature);
        } else {
          getCountyInfo(hoveredFeature);
        }

        if (hoveredStateSource.current) {
          map.setFeatureState(
            { source: hoveredStateSource.current, id: hoveredStateId.current },
            { hover: false }
          );
        }

        hoveredStateId.current = hoveredFeature.id;
        hoveredStateSource.current = hoveredFeature.source;

        map.setFeatureState(
          { source: hoveredStateSource.current, id: hoveredStateId.current },
          { hover: true }
        );
      } else {
        setPopupCoords({});
        map.setFeatureState(
          {
            source: hoveredStateSource.current || hoveredLayer,
            id: hoveredStateId.current,
          },
          { hover: false }
        );

        hoveredStateId.current = null;
        hoveredStateSource.current = null;
      }
    }
  };

  const datesHeader = useMemo(
    () =>
      trackers?.columns.filter((column) =>
        moment(column, "M/D/YY", true).isValid()
      ),
    [trackers]
  );

  const getMonthlyCases = (dataSet) =>
    d3
      .nest()
      .key((d) => moment(d.date, "M/D/YY", true).format("MMMM"))
      .entries(dataSet);

  const updatedStateData = useMemo(() => {
    if (statesInfo.length && selectedState) {
      const stateInfo = statesInfo.find((state) => state.key === selectedState);

      const stateMonthlyCases = getMonthlyCases(stateInfo.value);

      const formalizedStateCasesData = d3
        .nest()
        .rollup(() => stateMonthlyCases)
        .entries([stateInfo]);

      return formalizedStateCasesData;
    }
  }, [selectedState, statesInfo]);

  const updateCountyData = useMemo(() => {
    if (trackers && selectedCounty) {
      const countyInfo = trackers.find(
        (county) => +county.FIPS === +selectedCounty
      );

      if (countyInfo) {
        const countyDayliChanges = datesHeader.map((date, index, dates) => ({
          date,
          cases:
            index > 0
              ? +countyInfo[date] - +countyInfo[dates[index - 1]]
              : +countyInfo[date],
        }));

        const countyMonthlyCases = getMonthlyCases(countyDayliChanges);

        return countyMonthlyCases;
      }
    }
  }, [selectedCounty, trackers, datesHeader]);

  const getStateInfo = (feature) => {
    const stateName = feature.properties.NAME;

    setSelectedState(stateName);
  };

  const getCountyInfo = (feature) => {
    const { GEO_ID /*  STATE, NAME */ } = feature.properties;

    const indStartPos = GEO_ID.includes("US0")
      ? GEO_ID.indexOf("US0") + 3
      : GEO_ID.indexOf("US") + 2;
    const countyFIPS = GEO_ID.substring(indStartPos, GEO_ID.length);

    setSelectedCounty(countyFIPS);
  };

  useEffect(() => {
    if (
      !isMapLoaded ||
      isTrackersLoading ||
      isStatesLoading ||
      isCountiesLoading
    ) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [
    isMapLoaded,
    isTrackersLoading,
    trackers,
    isCountiesLoading,
    isStatesLoading,
  ]);

  useEffect(() => {
    setIsCountiesLoading(true);
    setIsStatesLoading(true);

    import("../data/gz_2010_us_050_00_500k.json").then((counties) => {
      setUsGeoJsonCounties(counties.default);
      setIsCountiesLoading(false);
    });
    import("../data/gz_2010_us_040_00_500k.json").then((states) => {
      setUsGeoJsonStates(states.default);
      setIsStatesLoading(false);
    });
  }, []);

  useEffect(() => {
    if (trackers) {
      const formalizedData = d3
        .nest()
        .key((d) => d.Province_State)
        .rollup((v) =>
          v.reduce(
            (commonCounty, currentCounty, countyIndex, counties) =>
              datesHeader.map((date, index, dates) => ({
                date,
                cases:
                  countyIndex > 0
                    ? index > 0
                      ? +counties[countyIndex - 1][date] -
                        +counties[countyIndex - 1][dates[index - 1]] +
                        +currentCounty[date] -
                        +currentCounty[dates[index - 1]]
                      : +counties[countyIndex - 1][date] + +currentCounty[date]
                    : +currentCounty[date],
              })),
            {}
          )
        )
        .entries(trackers);

      setStatesInfo(formalizedData);
    }
  }, [trackers, datesHeader]);

  return (
    <div className="map-container">
      {isLoading && (
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
        mapStyle="mapbox://styles/alexnorvag/ck9efq0oz2d0x1ioftrtazzyz"
        // mapStyle="mapbox://styles/alexnorvag/ck9efq0oz2d0x1ioftrtazzyz/draft"

        onViewStateChange={_onViewStateChange}
        onLoad={_onLoad}
        onHover={_onMouseHover}
        minZoom={ZOOM.MIN}
        maxZoom={ZOOM.MAX}
      >
        {Object.entries(popupCoords).length !== 0 && (
          <Popup
            latitude={popupCoords.latitude}
            longitude={popupCoords.longitude}
            closeButton={false}
            // anchor={"top"}
            anchor={"bottom-right"}
          >
            <div className="popup-container">
              <div className="popup-chart">
                {!error ? (
                  (isStateMode ? updatedStateData : updateCountyData) && (
                    <MultilineChart
                      data={isStateMode ? updatedStateData : updateCountyData}
                      header={"Daily changes in Covid-19 confirmations"}
                      xAxisLabel={"Date"}
                      yAxisLabel={"Daily changes"}
                      xAxisTicks={32}
                      yAxisTicks={26}
                      width={650}
                      height={390}
                      margins={{ top: 50, right: 10, bottom: 50, left: 60 }}
                      legendMargins={{ top: 20, right: 0, bottom: 0, left: 10 }}
                    />
                  )
                ) : (
                  <ErrorPopup />
                )}
              </div>
            </div>
          </Popup>
        )}
        {usGeoJsonCounties.length !== 0 && (
          <Source
            id="counties"
            type="geojson"
            data={usGeoJsonCounties}
            ref={_sourceRef}
            generateId={true}
          >
            <Layer {...countiesBoundLayer} beforeId={"waterway-label"} />
            <Layer {...countiesBorderLayer} beforeId={"waterway-label"} />
          </Source>
        )}
        {usGeoJsonStates.length !== 0 && (
          <Source
            id="states"
            type="geojson"
            data={usGeoJsonStates}
            ref={_sourceRef}
            generateId={true}
          >
            <Layer {...statesBoundLayer} beforeId={"waterway-label"} />
            <Layer {...statesBorderLayer} beforeId={"waterway-label"} />
          </Source>
        )}

        <div className="map-navigation">
          <NavigationControl showCompass={false} />
        </div>
      </ReactMapGL>
    </div>
  );
};

export default Map;
