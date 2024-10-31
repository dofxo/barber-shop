import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import { HashRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorBoundaryFallBack from "./components/general/ErrorBoundaryFallBack.tsx";
import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorBoundaryFallBack}>
      <HelmetProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
