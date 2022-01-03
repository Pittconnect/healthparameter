import { csvParse } from "d3-dsv";
import { group, rollup } from "d3-array";
import { timeParse } from "d3-time-format";

import { getShortMonth, getYear, isDateValid } from "../../../../utils/dates";
import { usaStatesAbbr } from "../../../../helpers";
import { formalize } from "../../../../utils/arrays";

export const parseCSV = csvParse;

export const groupTrackerData = (data) => {
  const dates = data?.columns.filter((column) => isDateValid(new Date(column)));

  const groupedData = rollup(
    data,
    ([county]) => {
      let entries = {};

      dates.forEach((date, dateIdx, originalDates) => {
        let value = +county[date];

        if (dateIdx) {
          value -= +county[originalDates[dateIdx - 1]];
        }

        entries[date] = value;
      });

      return entries;
    },

    (d) =>
      usaStatesAbbr.find(({ label }) => label === d.Province_State)?.id ??
      d.Province_State,
    (d) => d.Admin2
  );

  return groupedData;
};

const dateParse = timeParse("%m/%d/%y");

const groupByDate = (data) => {
  const groupedData = group(
    data,
    (d) => `${getShortMonth(d.date)} ${getYear(d.date)}`
  );

  return groupedData;
};

export const getFeatureEntries = (feature) => {
  const features = Object.entries(feature);

  const featureEntries = formalize(features, (key, value) => ({
    date: dateParse(key),
    value,
  }));

  const grouped = groupByDate(featureEntries);

  const entries = formalize(grouped, (key, value) => ({
    label: key,
    data: value,
  }));

  return entries;
};
