import React from "react";
import * as actions from "../redux/actions";

const ConnectToServer = () => {
  const [serverAddress, setServerAddress] = React.useState("");
  const onChange = React.useCallback(
    ({ target: { value } }: { target: { value: string } }) => {
      setServerAddress(value);
    },
    []
  );
  const connectToServer = actions.useApi().connectToServer;
  return (
    <div>
      Server:
      <input value={serverAddress} onChange={onChange} />
      <button onClick={() => connectToServer(serverAddress)}>Connect</button>
    </div>
  );
};

export default ConnectToServer;
