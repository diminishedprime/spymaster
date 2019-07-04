import React from "react";
import * as actions from "../redux/actions";
import * as redux from "../redux";

const ConnectToServer = () => {
  const [serverAddress, setServerAddress] = React.useState("10.0.0.5:3003");
  const socket = redux.useSelector(redux.lens.socket.get);
  const dispatch = redux.useDispatch();

  const onChange = React.useCallback(
    ({ target: { value } }: { target: { value: string } }) => {
      setServerAddress(value);
    },
    []
  );

  const connect = React.useCallback(
    () => dispatch(actions.connectWebsocket(serverAddress)),
    [dispatch, serverAddress]
  );

  // Automatically connect after 200ms.
  React.useEffect(() => {
    setTimeout(connect, 200);
  }, [connect]);

  return socket.isNone() ? (
    <div>
      Server:
      <input value={serverAddress} onChange={onChange} />
      <button onClick={connect}>Connect</button>
    </div>
  ) : null;
};

export default ConnectToServer;
