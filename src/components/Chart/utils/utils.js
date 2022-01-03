export const getSeriesStatus = (
  series,
  focusedDatum,
  activeSeriesIndexes = []
) => {
  if (focusedDatum?.seriesId === series.id) {
    return "focused";
  }
  if (
    activeSeriesIndexes.some((activeSeries) => activeSeries === series.index)
  ) {
    return "active";
  }
  if (activeSeriesIndexes.length || focusedDatum) {
    return "inactive";
  }

  return "none";
};

export const getDatumStatus = (datum, focusedDatum) => {
  if (datum === focusedDatum) {
    return "focused";
  }

  if (
    // eslint-disable-next-line array-callback-return
    datum.tooltipGroup?.some((groupDatum) => {
      if (groupDatum.seriesId === focusedDatum?.seriesId)
        return groupDatum.index === focusedDatum?.index;
    })
  ) {
    return "groupFocused";
  }

  return "none";
};

const elementTypes = ["area", "line", "rectangle", "circle"];

export const materializeStyles = (style = {}, defaults = {}) => {
  style = normalizeColor(style, defaults);
  for (let i = 0; i < elementTypes.length; i++) {
    const type = elementTypes[i];
    if (style[type] && defaults[type]) {
      style[type] = materializeStyles(style[type], defaults);
    }
  }
  return style;
};

const normalizeColor = (style, defaults) => {
  return {
    ...style,
    stroke: style.stroke || style.color || defaults.stroke || defaults.color,
    fill: style.fill || style.color || defaults.fill || defaults.color,
  };
};

export const translate = (x, y) => {
  return `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
};

export const isDefined = (num) => {
  return typeof num === "number" && !Number.isNaN(num);
};
