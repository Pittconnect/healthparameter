const COUNTIES_TILESET_LAYER_NAME =
  process.env.REACT_APP_MAPBOX_COUNTIES_TILESET_LAYER_NAME;

const countiesBoundLayer = {
  id: "county-bound",
  type: "fill",
  source: "counties",
  "source-layer": COUNTIES_TILESET_LAYER_NAME,
  minzoom: 5,
  layout: {},
  filter: ["==", "$type", "Polygon"],
  paint: {
    "fill-color": "#FFFFFF",
    "fill-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      0.6,
      0.2,
    ],
  },
};

const countiesBorderLayer = {
  id: "county-border",
  type: "line",
  source: "counties",
  "source-layer": COUNTIES_TILESET_LAYER_NAME,
  minzoom: 5,
  layout: {},
  paint: {
    "line-color": "#FFFFFF",
    "line-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      1,
      0.5,
    ],
    "line-width": 1.4,
  },
};

export const countiesLayers = [countiesBoundLayer, countiesBorderLayer];
