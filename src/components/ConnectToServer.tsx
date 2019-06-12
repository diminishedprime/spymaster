import React from "react";
import * as actions from "../redux/actions";

const ConnectToServer = () => {
  const [serverAddress, setServerAddress] = React.useState("10.0.0.5:3003");
  const { connectToServer } = actions.useApi();

  const onChange = React.useCallback(
    ({ target: { value } }: { target: { value: string } }) => {
      setServerAddress(value);
    },
    []
  );

  const onClick = React.useCallback(() => {
    connectToServer(serverAddress);
  }, [serverAddress, connectToServer]);

  React.useEffect(() => {
    setTimeout(() => {
      onClick();
    }, 100);
  }, [onClick]);

  return (
    <div>
      Server:
      <input value={serverAddress} onChange={onChange} />
      <button onClick={onClick}>Connect</button>
    </div>
  );
};

export default ConnectToServer;
