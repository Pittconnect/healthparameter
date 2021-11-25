import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.mapbox.com/geocoding/v5/mapbox.places",
  responseType: "json",
});

export default instance;
