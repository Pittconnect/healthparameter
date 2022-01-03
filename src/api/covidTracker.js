import api from "../services/covidTrackerApi";

export const fetchCovidTrackedData = async () => {
  try {
    const { data } = await api.get("/time_series_covid19_confirmed_US.csv");
    let error;

    if (!data) {
      error = "No new cases";
    }

    return { data, error };
  } catch (error) {
    return { error: error.message };
  }
};
