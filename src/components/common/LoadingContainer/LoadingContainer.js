import React from "react";
import LoadingOverlay from "../Overlay/LoadingOverlay";

const LoadingContainer = ({ loading, loadingText, children }) => (
  <>
    <LoadingOverlay loading={loading} loadingText={loadingText} />
    {children}
  </>
);

export default LoadingContainer;
