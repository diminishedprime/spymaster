import React from "react";
import * as t from "../types";
import R from "ramda";
import { connect } from "react-redux";

import Lobby from "./lobby";
import ConnectToServer from "./connect-to-server";
import ErrorBar from "./error-bar";
import Game from "./game";
import PickTeam from "./pick-team";
import PickUsername from "./pick-username";
import Win from "./win";
import { afToggleTitle } from "../redux/actions";
import {
  errorTextPath,
  showTitlePath,
  page,
  winnerPath,
  connectedPath
} from "../redux/paths";

const appStyle: React.CSSProperties = {
  fontFamily: "Helvetica",
  margin: "auto",
  border: "3px solid #f6f8fa",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const titleStyle: React.CSSProperties = {
  paddingTop: "5px",
  paddingBottom: "5px",
  textAlign: "center",
  fontSize: "2.5em",
  backgroundColor: "#f6f8fa"
};

interface StateProps {
  winner: string;
  hasError: boolean;
  showTitle: boolean;
  page: t.Page;
  connected: boolean;
}

interface DispatchProps {
  toggleTitle: () => void;
}

type AllProps = DispatchProps & StateProps;

const mapStateToProps = (state: t.ReduxState): StateProps => ({
  winner: R.view(winnerPath, state),
  hasError: R.view(errorTextPath, state),
  showTitle: R.view(showTitlePath, state),
  page: R.view(page, state),
  connected: R.view(connectedPath, state)
});

const mapDispatchToProps = (dispatch: t.Dispatch): DispatchProps => ({
  toggleTitle: () => dispatch<t.ToggleTitle>(afToggleTitle())
});

const App: React.FC<AllProps> = ({
  hasError,
  showTitle,
  toggleTitle,
  page,
  winner,
  connected
}) => (
  <div style={appStyle}>
    {hasError && <ErrorBar />}
    {!connected && <ConnectToServer />}
    {connected && !winner && (
      <div>
        {showTitle && (
          <div style={titleStyle} onClick={toggleTitle}>
            Spymaster
          </div>
        )}
        {page === t.Page.LOBBY && <Lobby />}
        {page === t.Page.GAME_MODE_GAME && <Game />}
        {page === t.Page.GAME_MODE_PICK_TEAM && <PickUsername />}
        {page === t.Page.GAME_MODE_PICK_TEAM && <PickTeam />}
      </div>
    )}
    {connected && winner && <Win />}
  </div>
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
