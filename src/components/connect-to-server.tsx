import React from "react";
import R from "ramda";
import { connect } from "react-redux";
import { afConnectToServer, afUpdateServerAddress } from "./../redux/actions";
import { serverAddressPath, connectedPath } from "./../redux/paths";
import * as t from "../types";

interface StateProps {
  serverAddress: string;
  connected: boolean;
}

interface DispatchProps {
  connectToServer: (serverAddress: string) => () => void;
  onChange: ({ target: { value } }: { target: { value: string } }) => void;
}

type AllProps = StateProps & DispatchProps;

const mapStateToProps = (state: t.ReduxState): StateProps => ({
  serverAddress: R.view(serverAddressPath, state),
  connected: R.view(connectedPath, state)
});

const mapDispatchToProps = (dispatch: t.Dispatch): DispatchProps => ({
  connectToServer: serverAddress => () =>
    dispatch(afConnectToServer(serverAddress)),
  onChange: ({ target: { value } }) => dispatch(afUpdateServerAddress(value))
});

const ConnectToServer = ({
  connectToServer,
  serverAddress,
  onChange
}: AllProps) => (
  <div>
    Server:
    <input value={serverAddress} onChange={onChange} />
    <button onClick={connectToServer(serverAddress)}>Connect</button>
  </div>
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectToServer);
