import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import React from "react";
import Map from "./components/Map";

import "./app.scss";

function App() {
  return (
    <div className="App">
      <div className="App-container">
        <div className="covid-map">
          <Map />
        </div>
      </div>
    </div>
  );
}

export default App;
