import React from "react";
import * as t from "./../types";
import { connect } from "react-redux";
import * as lens from "../redux/lenses";
import { afFlipCard } from "./../redux/actions";
import * as actions from "../redux/actions";
import styled from "styled-components";

/* interface StateProps {
 *   text: string;
 *   style: React.CSSProperties;
 *   disabled: boolean;
 *   currentTeam: t.Team;
 *   playerTeam: t.Team;
 *   role: t.Role;
 * } */

interface DispatchProps {
  flip: () => void;
}

interface CardProps {
  cardId: t.CardId;
}

type AllProps = DispatchProps & CardProps;

const CardWrapper = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
  min-width: 10.5em;
`;

/* const mapStateToProps = (
 *   state: t.ReduxState,
 *   { cardId }: CardProps
 * ): StateProps => {
 *   const cardTeam: t.Team = R.view(cardTeamByCardId(cardId), state);
 *   const text: string = R.view(cardTextByCardId(cardId), state);
 *   const flipped: boolean = R.view(cardFlippedByCardId(cardId), state);
 *   const role: t.Role = R.view(rolePath, state);
 *   const styleForTeam: React.CSSProperties = R.view(
 *     styleForTeamPath(cardTeam),
 *     state
 *   );
 *   const playerTeam: t.Team = R.view(teamPath, state);
 *   const currentTeam: t.Team = R.view(currentTeamPath, state);
 *   const hintSubmitted: boolean = R.view(hintSubmittedPath, state);
 *   const baseStyle: React.CSSProperties = {
 *     color: "#000000",
 *     backgroundColor: "#ffffff"
 *   };
 *   const style: React.CSSProperties =
 *     flipped || role === "spymaster"
 *       ? R.compose(R.assoc("opacity", flipped ? 0.2 : 1.0))(styleForTeam)
 *       : baseStyle;
 *   const disabled: boolean =
 *     role === "spymaster" ||
 *     playerTeam !== currentTeam ||
 *     flipped ||
 *     !hintSubmitted;
 *   return {
 *     text,
 *     style,
 *     playerTeam,
 *     role,
 *     currentTeam,
 *     disabled
 *   };
 * }; */

const mapDispatchToProps = (
  dispatch: t.Dispatch,
  { cardId }: CardProps
): DispatchProps => {
  return {
    flip: () => {
      return dispatch(afFlipCard(cardId));
    }
  };
};

const Card: React.FC<AllProps> = ({ flip, cardId }) => {
  const role = actions.useLens(lens.role);
  const playerTeam = actions.useLens(lens.team);
  // TODO - Is there something we can do about all the bangs (!) here?
  const currentTeam = actions.useLens(lens.currentTeam!);
  const flipped = actions.useLens(t.lens.cardFlipped(cardId)!);
  const cardTeam = actions.useLens(lens.cardTeam(cardId)!);
  const hintSubmitted = actions.useLens(lens.hintSubmitted!);
  const disabled =
    role === t.Role.SPYMASTER ||
    playerTeam !== currentTeam ||
    flipped ||
    !hintSubmitted;
  const text = actions.useLens(lens.cardText(cardId)!);
  const style = actions.useLens(lens.teamStyle(cardTeam)!);
  const state = actions.useSelector(a => {
    return a;
  });
  console.log({ style, text, cardTeam, state });
  return (
    <CardWrapper style={style} disabled={disabled} onClick={flip}>
      {text}
    </CardWrapper>
  );
};

export default connect(
  undefined,
  mapDispatchToProps
)(Card);
