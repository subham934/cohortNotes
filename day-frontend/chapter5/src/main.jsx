import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.jsx";
import { store } from "./redux/store.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);

// https://atlantic-jellyfish-c1f.notion.site/Redux-Toolkit-Complete-Beginner-Documentation-320b5aac78f780ee9b55db9ba6592cfe#320b5aac78f780f99352fc4a64d40325

// https://github.com/saarthack/redux-basics/tree/main/src/components
