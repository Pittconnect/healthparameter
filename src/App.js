import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import MainRoutes from "./routes/components/MainRoutes";
import { AuthProvider } from "./context/Auth/authContext";
import { UserProvider } from "./context/User/userContext";
import { RedirectContainer } from "./layout";

import "./app.scss";

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <div className="app">
            <div className="app-container uk-width-1-1">
              <RedirectContainer>
                <MainRoutes />
              </RedirectContainer>
            </div>
          </div>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
