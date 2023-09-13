import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { OrgIdProvider } from "./context/OrganisationContext";
import axios from "axios";

axios.defaults.withCredentials = true;
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <CookiesProvider>
    <BrowserRouter>
      <OrgIdProvider>
        <App />
      </OrgIdProvider>
    </BrowserRouter>
  </CookiesProvider>
);
