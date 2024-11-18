import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Side from "./components/ui/Side";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Side />
    <App />
  </React.StrictMode>
);
