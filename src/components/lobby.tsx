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
  userId: t.UserId;
}

interface DispatchProps {
  newGame: () => void;
  joinGame: (gameId: string, userid: t.UserId) => () => void;
}

type AllProps = StateProps & DispatchProps;

const mapStateToProps = (state: t.ReduxState): StateProps => ({
  gameIds: R.view(gameIdsPath, state),
  userId: state.localState.username
});

const mapDispatchToProps = (dispatch: t.Dispatch): DispatchProps => ({
  newGame: () => dispatch<t.NewGame2>(afNewGame2()),
  joinGame: (gameId: t.GameId, userId: t.UserId) => () =>
    dispatch(afJoinGame(gameId, userId))
});

interface JoinGameProps {
  gameId: t.GameId;
  joinGame: () => void;
}

const JoinGame: React.FC<JoinGameProps> = ({ gameId, joinGame }) => (
  <button onClick={joinGame}>{gameId.substring(0, 8)}</button>
);

const Lobby: React.FC<AllProps> = ({ newGame, gameIds, joinGame, userId }) => (
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
              joinGame={joinGame(gameId, userId)}
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
