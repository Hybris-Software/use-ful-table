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
  baseUrl: "https://9d9874c0-3e0a-4f65-8e89-f285475ed554.mock.pstmn.io/",
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

reportWebVitals();
