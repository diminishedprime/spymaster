import React from "react";
import ConnectToServer from "./ConnectToServer";
import styled from "styled-components";
import Lobby from "./Lobby";
import Game from "./Game";
import * as r from "../redux";
import * as a from "../redux/actions";
/* import * as t from "../types";
 * import ErrorBar from "./ErrorBar";
 * import Game from "./game";
 * import PickTeam from "./pick-team";
 * import PickUsername from "./pick-username";
 * import Win from "./win";
 * import * as actions from "../redux/actions";
 * import * as lens from "../redux/lenses";
 *
 *
 * const TitleWrapper = styled.div`
 *   padding-top: 5px;
 *   padding-bottom: 5px;
 *   text-align: center;
 *   font-size: 2.5em;
 *   background-color: #f6f8fa;
 * `;
 *
 * const Title: React.FC = () => {
 *   const [showTitle, setShowTitle] = React.useState(true);
 *
 *   const toggleTitle = React.useCallback(() => {
 *     setShowTitle(a => {
 *       return !a;
 *     });
 *   }, []);
 *
 *   return showTitle ? (
 *     <TitleWrapper onClick={toggleTitle}>Spymaster</TitleWrapper>
 *   ) : null;
 * };
 *
 * const App: React.FC = () => {
 *   const page = actions.useLens(lens.page);
 *   const connected = actions.useLens(lens.connected);
 *   const winner = actions.useLens(lens.winner!);
 *   return (
 *     <Wrapper>
 *       <Title />
 *       <ErrorBar />
 *       {!connected && <ConnectToServer />}
 *       {connected && !winner && (
 *         <div>
 *           {page === t.Page.LOBBY && <Lobby />}
 *           {page === t.Page.GAME_MODE_GAME && <Game />}
 *           {page === t.Page.GAME_MODE_PICK_TEAM && <PickUsername />}
 *           {page === t.Page.GAME_MODE_PICK_TEAM && <PickTeam />}
 *         </div>
 *       )}
 *       {connected && winner && <Win />}
 *     </Wrapper>
 *   );
 * };
 *
 * export default App; */

const Wrapper = styled.div`
  font-family: Helvetica;
  margin: 0 auto;
  max-width: 50em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Debug: React.FC = () => {
  const game = r.useSelector(t => t.game);
  const page = r.useSelector(t => t.page);
  const socket = r.useSelector(s => s.socket);
  const dispatch = r.useDispatch();
  const games = r.useSelector(t => t.gameIds);

  React.useEffect(() => {
    setTimeout(() => {
      dispatch(a.connectWebsocket("10.0.0.5:3003"));
    }, 200);
  }, [dispatch]);

  React.useEffect(() => {
    if (socket.isSome()) {
      if (games.length < 1) {
        dispatch(a.newGame());
      } else {
        dispatch(a.joinGame(games[0]));
      }
    }
  }, [dispatch, games, socket]);

  return (
    <div>
      <h3>Game</h3>
      <div>{JSON.stringify(game.isSome() ? game.value : {})}</div>
      <h3>Page</h3>
      <div>{JSON.stringify(page)}</div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Wrapper>
      <ConnectToServer />
      <Lobby />
      <Game />
      <Debug />
    </Wrapper>
  );
};

export default App;
