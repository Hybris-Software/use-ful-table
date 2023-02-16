import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { generateApiClient, ApiProvider } from "@hybris-software/use-query";
import { ThemeProvider } from "@hybris-software/ui-kit";
import "./index.css";
import Theme from "./Theme.module.css";


const root = ReactDOM.createRoot(document.getElementById("root"));
const apiClient = generateApiClient({
  baseUrl: "http://localhost:8000/api/v1/",
  authorizationHeader: "Authorization",
  authorizationPrefix: "Token ",
});
root.render(
  <ThemeProvider
  theme={{
    button: {
      buttonClassName: Theme.buttonClass,
      buttonDisabledClassName: Theme.buttonDisabledClass,
      loader: <div className={Theme.buttonLoader}>loading...</div>,
    },
  }}
  >
    <ApiProvider apiClient={apiClient}>
      <App />
    </ApiProvider>
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
