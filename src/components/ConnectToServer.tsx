import React from "react";
import * as actions from "../redux/actions";
import * as redux from "../redux";

const ConnectToServer = () => {
  const [serverAddress, setServerAddress] = React.useState("10.0.0.5:3003");
  const dispatch = redux.useDispatch();

  const onChange = React.useCallback(
    ({ target: { value } }: { target: { value: string } }) => {
      setServerAddress(value);
    },
    []
  );

  const onClick = React.useCallback(() => {
    dispatch(actions.connectWebsocket(serverAddress));
  }, [serverAddress]);

  return (
    <div>
      Server:
      <input value={serverAddress} onChange={onChange} />
      <button onClick={onClick}>Connect</button>
    </div>
  );
};

export default ConnectToServer;
