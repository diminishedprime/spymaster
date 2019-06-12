import React from "react";
import * as t from "../types";
import styled from "styled-components";
import Lobby from "./lobby";
import ConnectToServer from "./ConnectToServer";
import ErrorBar from "./ErrorBar";
import Game from "./game";
import PickTeam from "./pick-team";
import PickUsername from "./pick-username";
import Win from "./win";
import * as actions from "../redux/actions";
import * as lens from "../redux/lenses";

const Wrapper = styled.div`
  font-family: Helvetica;
  margin: 0 auto;
  max-width: 50em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TitleWrapper = styled.div`
  padding-top: 5px;
  padding-bottom: 5px;
  text-align: center;
  font-size: 2.5em;
  background-color: #f6f8fa;
`;

const Title: React.FC = () => {
  const [showTitle, setShowTitle] = React.useState(true);

  const toggleTitle = React.useCallback(() => {
    setShowTitle(a => !a);
  }, []);

  return showTitle ? (
    <TitleWrapper onClick={toggleTitle}>Spymaster</TitleWrapper>
  ) : null;
};

const App: React.FC = () => {
  const page = actions.useLensSelector(lens.page);
  const hasError = actions.useLensSelector(lens.errorText);
  const connected = actions.useLensSelector(lens.connected);
  const winner = actions.useLensSelector(lens.winner!);
  return (
    <Wrapper>
      <Title />
      {hasError && <ErrorBar />}
      {!connected && <ConnectToServer />}
      {connected && !winner && (
        <div>
          {page === t.Page.LOBBY && <Lobby />}
          {page === t.Page.GAME_MODE_GAME && <Game />}
          {page === t.Page.GAME_MODE_PICK_TEAM && <PickUsername />}
          {page === t.Page.GAME_MODE_PICK_TEAM && <PickTeam />}
        </div>
      )}
      {connected && winner && <Win />}
    </Wrapper>
  );
};

export default App;
