import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Provider } from "react-redux";
import NotificationService from "./services/notification";
import ConfirmDialogService from "./services/confirmDialog";
import store from "./store";
import { BASE_URL } from "./utils/constants";
import axios from "axios";
function Root() {
  axios.defaults.baseURL = BASE_URL;
  axios.defaults.withCredentials = true;

  return (
    <BrowserRouter>
      <NotificationService>
        <ConfirmDialogService>
          <Provider store={store}>
            <App />
          </Provider>
        </ConfirmDialogService>
      </NotificationService>
    </BrowserRouter>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement).render(<Root />);
