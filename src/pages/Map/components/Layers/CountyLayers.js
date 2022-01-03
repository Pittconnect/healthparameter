const countiesBoundLayer = {
  id: "county-bound",
  type: "fill",
  source: "counties",
  "source-layer": "gz_2010_us_050_00_500k-7up5re",
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
  "source-layer": "gz_2010_us_050_00_500k-7up5re",
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
