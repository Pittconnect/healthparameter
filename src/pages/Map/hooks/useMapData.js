import { useCallback, useContext, useEffect, useState } from "react";

import { fetchRegion } from "../../../api/mapbox";
import { UserContext } from "../../../context/User/userContext";
import { usaStatesAbbr } from "../../../helpers";

export const useMapData = () => {
  const {
    state: {
      me: { location },
      loading,
    },
  } = useContext(UserContext);
  const [viewport, setViewport] = useState();

  const regionViewport = useCallback(async (region) => {
    const state = usaStatesAbbr.find(({ value }) => value === region);

    const { data, error } = await fetchRegion(state);

    if (error) {
      setViewport();
      return;
    }

    setViewport({ longitude: data[0], latitude: data[1], zoom: 6.5 });
  }, []);

  useEffect(() => {
    if (loading || !location) return;

    regionViewport(location);
  }, [regionViewport, loading, location]);

  return {
    viewport,

    regionViewport,
  };
};
