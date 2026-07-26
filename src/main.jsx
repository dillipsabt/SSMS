import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.jsx";
import { store } from "./app/store";
import { ThemeProvider } from "./theme/ThemeProvider";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>
);
