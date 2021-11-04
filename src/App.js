import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import MainRoutes from "./routes/components/MainRoutes";
import { UserProvider } from "./context/user";
import { RedirectContainer } from "./layout";

import "./app.scss";

function App() {
  return (
    <Router>
      <UserProvider>
        <div className="app">
          <div className="app-container uk-width-1-1">
            <RedirectContainer>
              <MainRoutes />
            </RedirectContainer>
          </div>
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;
