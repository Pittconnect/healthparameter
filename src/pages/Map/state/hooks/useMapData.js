import { useCallback, useContext, useEffect, useState } from "react";

import { fetchRegion } from "../../../../api/mapbox";
import { fetchCovidTrackedData } from "../../../../api/covidTracker";
import { UserContext } from "../../../../context/User/userContext";
import { usaStatesAbbr } from "../../../../helpers";
import {
  groupTrackerData,
  parseCSV,
  getFeatureEntries,
} from "../utils/tracker";
import { sumObjectsByKey } from "../../../../utils/objects";

export const useMapData = () => {
  const {
    state: {
      me: { location },
      loading: userLoading,
    },
  } = useContext(UserContext);
  const [viewport, setViewport] = useState();
  const [trackersData, setTrackersData] = useState();
  const [featureData, setFeatureData] = useState();
  const [popupCoordinates, setPopupCoordinates] = useState();
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);

  const getRegionViewport = useCallback(async (region) => {
    const state = usaStatesAbbr.find(({ value }) => value === region);

    const { data, error } = await fetchRegion(state);

    if (error) {
      setViewport();
      return;
    }

    setViewport({ longitude: data[0], latitude: data[1], zoom: 6.5 });
  }, []);

  const getTrackersData = useCallback(async () => {
    const { data, error } = await fetchCovidTrackedData();

    setIsDataLoading(false);

    if (error) {
      return;
    }

    const parsedData = parseCSV(data);
    const trackerData = groupTrackerData(parsedData);
    setTrackersData(trackerData);
  }, []);

  const getCountyData = useCallback(
    (featureProps) => {
      const state = featureProps.STATE;
      const county = featureProps.NAME;

      const countyData = trackersData.get(state).get(county);
      const featureEntries = getFeatureEntries(countyData);

      return featureEntries;
    },
    [trackersData]
  );

  const getStateData = useCallback(
    (featureProps) => {
      const state = featureProps.STATE;

      const stateEntries = trackersData.get(state).values();
      const stateData = sumObjectsByKey(Array.from(stateEntries));
      const featureEntries = getFeatureEntries(stateData);

      return featureEntries;
    },
    [trackersData]
  );

  const getFeatureData = useCallback(
    (featureProps) => {
      let getData = getStateData;

      if (featureProps.COUNTY) {
        getData = getCountyData;
      }

      const featureData = getData(featureProps);

      return { name: featureProps.NAME, data: featureData };
    },
    [getCountyData, getStateData]
  );

  const updateFeatureData = (feature) => {
    const updatedFeature = getFeatureData(feature.properties);
    setFeatureData(updatedFeature);
  };

  const updatePopupCoordinates = (location) => {
    let coordinates;

    if (location) {
      const [longitude, latitude] = location;
      coordinates = { longitude, latitude };
    }

    setPopupCoordinates(coordinates);
  };

  const onMapLoading = useCallback(() => {
    setIsMapLoading(false);
  }, []);

  useEffect(() => {
    if (userLoading || !location) return;
    setIsDataLoading(true);

    getRegionViewport(location);
    getTrackersData();
  }, [userLoading, location, getRegionViewport, getTrackersData]);

  return {
    isLoading: isDataLoading || isMapLoading,
    viewport,
    featureData,
    popupCoordinates,

    updateFeatureData,
    updatePopupCoordinates,
    onMapLoading,
  };
};
