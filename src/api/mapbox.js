import mapboxApi from "../services/mapboxApi";

export const fetchRegion = async ({ label, value }) => {
  const query = label.replace(/ /g, "%20");

  try {
    const { data } = await mapboxApi.get(
      `/${query}.json?types=country&types=region&access_token=${process.env.REACT_APP_MAPBOX_ACCESS}`
    );

    const viewport = data.features
      .filter(({ properties }) => {
        const region = `US-${value}`.toLowerCase();
        const country = value.toLowerCase();

        if (!properties.short_code) return false;
        const shortCode = properties.short_code.toLowerCase();

        return shortCode === region || shortCode === country;
      })
      .shift().center;

    return { data: viewport, error: null };
  } catch (error) {
    console.log("ERROR");
    console.dir(error);
    return { error: error.message };
  }
};
