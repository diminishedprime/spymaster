import React from "react";
import * as t from "./../types";
import R from "ramda";
import { connect } from "react-redux";

import PickUsername from "./pick-username";
import ConnectedUsers from "./connected-users";
import { afNewGame2, afJoinGame } from "./../redux/actions";
import { gameIdsPath } from "./../redux/paths";

interface StateProps {
  gameIds: t.GameId[];
}

interface DispatchProps {
  newGame: () => void;
  joinGame: (gameId: string) => () => void;
}

type AllProps = StateProps & DispatchProps;

const mapStateToProps = (state: t.ReduxState): StateProps => ({
  gameIds: R.view(gameIdsPath, state)
});

const mapDispatchToProps = (dispatch: t.Dispatch): DispatchProps => ({
  newGame: () => dispatch(afNewGame2()),
  joinGame: (gameId: t.GameId) => () => dispatch(afJoinGame(gameId, undefined))
});

interface JoinGameProps {
  gameId: t.GameId;
  joinGame: () => void;
}

const JoinGame: React.FC<JoinGameProps> = ({ gameId, joinGame }) => (
  <button onClick={joinGame}>{gameId.substring(0, 8)}</button>
);

const Lobby: React.FC<AllProps> = ({ newGame, gameIds, joinGame }) => (
  <div>
    <button onClick={newGame}>New Game</button>
    <div>
      Join Existing Game
      <div>
        {R.map(
          gameId => (
            <JoinGame
              key={gameId}
              gameId={gameId}
              joinGame={joinGame(gameId)}
            />
          ),
          gameIds
        )}
      </div>
    </div>
    <PickUsername />
    <ConnectedUsers />
  </div>
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lobby);
