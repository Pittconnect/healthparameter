const STATES_TILESET_LAYER_NAME =
  process.env.REACT_APP_MAPBOX_STATES_TILESET_LAYER_NAME;

const statesBoundLayer = {
  id: "state-bound",
  source: "states",
  "source-layer": STATES_TILESET_LAYER_NAME,
  maxzoom: 5,
  type: "fill",
  layout: {},
  paint: {
    "fill-color": "#30cbef",
    "fill-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      0.6,
      0.2,
    ],
  },
};

const statesBorderLayer = {
  id: "state-borders",
  source: "states",
  "source-layer": STATES_TILESET_LAYER_NAME,
  type: "line",
  layout: {},
  paint: {
    "line-color": "#0fa2c4",
    "line-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      1,
      0.5,
    ],
    "line-width": ["interpolate", ["linear"], ["zoom"], 5, 2, 6, 6],
  },
};

export const statesLayers = [statesBoundLayer, statesBorderLayer];
