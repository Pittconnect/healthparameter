import axios from "axios";

const instance = axios.create({
  baseURL:
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series",
  responseType: "json",
});

export default instance;
