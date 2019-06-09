import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";

import { rootSaga } from "./sagas/index";
import { app } from "./reducers";

const sagaMiddleware = createSagaMiddleware();
export const store = createStore(app, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);
