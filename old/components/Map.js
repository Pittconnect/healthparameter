import React, { useRef, useState, useEffect } from "react";
import ReactMapGL, {
  Source,
  Layer,
  Popup,
  NavigationControl,
  WebMercatorViewport,
} from "react-map-gl";
import {
  statesBoundLayer,
  statesBorderLayer,
  countiesBoundLayer,
  countiesBorderLayer,
} from "./Layers";
import Spiner from "./spiner/Spiner";
import ConcentricChart from "./charts/ConcentricChart";
import CountyPopup from "./popup/County";

import { usaStatesAbbr, COVIDTRACKER_API_LINK, ZOOM, BOUNDS } from "../helpers";
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
    COVIDTRACKER_API_LINK
  );
  const [isLoading, setIsLoading] = useState(false);
  const [maxTotalTests, setMaxTotalTests] = useState(0);
  const [maxRsei, setMaxRsei] = useState(0);
  const [chartData, setChartData] = useState({});
  const [countyChartData, setCountyChartData] = useState({});
  const [rseiData, setRseiData] = useState([]);
  const [usGeoJsonCounties, setUsGeoJsonCounties] = useState([]);
  const [isCountiesLoading, setIsCountiesLoading] = useState(false);
  const [usGeoJsonStates, setUsGeoJsonStates] = useState([]);
  const [isStatesLoading, setIsStatesLoading] = useState(false);
  const [usRSEIScoreCounties, setUsRSEIScoreCounties] = useState([]);
  const [isRSEIScoreLoading, setIsRSEIScoreLoading] = useState(false);

  const mapRef = useRef();
  const _sourceRef = useRef();
  const hoveredStateId = useRef(null);
  const hoveredStateSource = useRef(null);
  const legendOnRight = useRef(true);

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
          setCountyChartData({});
          getStateInfo(hoveredFeature);
        } else {
          setChartData({});
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

  const getStateInfo = (feature) => {
    const stateName = feature.properties.NAME;
    const stateAbbr = usaStatesAbbr.find(
      (stateAbbr) => stateAbbr.label === stateName
    );

    let {
      positive,
      hospitalizedCurrently,
      hospitalizedCumulative,
      death,
      totalTestResults,
    } = trackers.find((tracker) => tracker.state === stateAbbr.value);

    if (!error) {
      setChartData({
        positive,
        hospitalizedCurrently: hospitalizedCumulative || hospitalizedCurrently,
        death,
        totalTestResults,
        stateName,
      });
    }
  };

  const getCountyInfo = (feature) => {
    const { GEO_ID, STATE, NAME } = feature.properties;

    const indStartPos = GEO_ID.includes("US0")
      ? GEO_ID.indexOf("US0") + 3
      : GEO_ID.indexOf("US") + 2;
    const countyFIPS = GEO_ID.substring(indStartPos, GEO_ID.length);

    const stateName = usaStatesAbbr.find((state) => state.id === STATE).label;
    const RSEIScore = rseiData[countyFIPS]?.[0]["RSEI Score"];

    const countyData = {
      headers: [
        { key: "State", value: stateName },
        { key: "County", value: NAME },
      ],
      data: [RSEIScore],
    };

    setCountyChartData(countyData);
  };

  useEffect(() => {
    const getMaxTotalTests = () =>
      trackers
        .slice()
        .sort((a, b) =>
          d3.descending(a.totalTestResults, b.totalTestResults)
        )[0];

    const getMaxRsei = () =>
      d3.max(usRSEIScoreCounties, (d) => d["RSEI Score"]);

    const getRseiData = () =>
      d3
        .nest()
        .key((d) => d.FIPS)
        .object(usRSEIScoreCounties);

    if (
      !isMapLoaded ||
      isTrackersLoading ||
      isStatesLoading ||
      isCountiesLoading ||
      isRSEIScoreLoading
    ) {
      setIsLoading(true);
    } else {
      setMaxTotalTests(getMaxTotalTests());
      setRseiData(getRseiData());
      setMaxRsei(getMaxRsei());
      setIsLoading(false);
    }
  }, [
    isMapLoaded,
    isTrackersLoading,
    trackers,
    usRSEIScoreCounties,
    isCountiesLoading,
    isRSEIScoreLoading,
    isStatesLoading,
  ]);

  useEffect(() => {
    setIsCountiesLoading(true);
    setIsStatesLoading(true);
    setIsRSEIScoreLoading(true);

    import("../data/gz_2010_us_050_00_500k.json").then((counties) => {
      setUsGeoJsonCounties(counties.default);
      setIsCountiesLoading(false);
    });
    import("../data/gz_2010_us_040_00_500k.json").then((states) => {
      setUsGeoJsonStates(states.default);
      setIsStatesLoading(false);
    });
    import("../data/counties-rsei-score.json").then((rsei) => {
      setUsRSEIScoreCounties(rsei.default);
      setIsRSEIScoreLoading(false);
    });
  }, []);

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
                {viewport.zoom < ZOOM.COUNTIES
                  ? Object.entries(chartData).length !== 0 && (
                      <ConcentricChart
                        data={chartData}
                        dataKeys={[
                          { totalTestResults: "Total" },
                          { positive: "Positive" },
                          { hospitalizedCurrently: "Hospitalized" },
                          { death: "Death" },
                        ]}
                        maxTotalTests={{
                          totalTestResults: maxTotalTests.totalTestResults,
                          hospitalizedCurrently:
                            maxTotalTests.hospitalizedCumulative ||
                            maxTotalTests.hospitalizedCurrently,
                        }}
                        width={legendOnRight.current ? 550 : 420}
                        height={legendOnRight.current ? 280 : 360}
                        top={10}
                        bottom={10}
                        left={10}
                        right={10}
                        legendWidth={legendOnRight.current ? 180 : 420}
                        legendHeight={legendOnRight.current ? 150 : 80}
                        legendTop={5}
                        legendRight={10}
                        legendBottom={5}
                        legendLeft={10}
                        useLegend={true}
                        legendOnRight={legendOnRight.current}
                      />
                    )
                  : Object.entries(countyChartData).length !== 0 && (
                      <CountyPopup
                        chartHeaders={countyChartData.headers}
                        chartData={
                          countyChartData.data[0]
                            ? [maxRsei, ...countyChartData.data]
                            : []
                        }
                      />
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
