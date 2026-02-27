import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./app/store.ts";
import App from "./App.tsx";
import "./index.css";
import { checkCurrentUser } from "./features/auth/authThunk.ts";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate
      loading={null}
      persistor={persistor}
      onBeforeLift={() => {
        store.dispatch(checkCurrentUser());
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>,
);
