import React, { createContext, useContext } from "react";

const ChartContext = createContext(null);

export const ChartContextProvider = ({ value, children }) => {
  return <ChartContext.Provider value={value} children={children} />;
};

const useChartContext = () => {
  return useContext(ChartContext)();
};

export default useChartContext;
