import React from "react";
import ReactDOM from "react-dom";
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
import "./index.css";
import App from "./App";

UIkit.use(Icons);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
