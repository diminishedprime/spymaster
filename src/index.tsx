import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";
import * as redux from "./redux/index";

ReactDOM.render(
  <Provider store={redux.createStore()}>
    <App />
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
