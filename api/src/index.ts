import * as path from "path";
import { createServer } from "http";

import express = require("express");

import { PORT, BASE_URL } from "../../src/constants";

import * as redux from "./redux/index";
import { connectWebsocket } from "./redux/actions";

// const options = {
//   key: fs.readFileSync('/etc/letsencrypt/live/spymaster.mjh.io/privkey.pem'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/spymaster.mjh.io/cert.pem'),
// }

const app = express();

const server = createServer(app);

// Connect websocket server
const store = redux.createStore();
store.dispatch(connectWebsocket(server));

// Serve static resources
app.use("/", express.static(path.resolve(__dirname + "/../../build/")));

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App is now running at ${BASE_URL}:${PORT}`);
});
