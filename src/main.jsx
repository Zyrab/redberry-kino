import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/auth-context.jsx";
import { FilterOptionsProvider } from "./context/filter-options-context.jsx";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <FilterOptionsProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </FilterOptionsProvider>
    </BrowserRouter>
  </StrictMode>,
);
