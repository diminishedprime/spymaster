import React from "react";
import * as t from "./../types";
import { connect } from "react-redux";

import { afNewGame } from "./../redux/actions";

interface DispatchProps {
  onClick: () => void;
}

type AllProps = DispatchProps;

const mapDispatchToProps = (dispatch: t.Dispatch): DispatchProps => ({
  onClick: () => dispatch(afNewGame())
});

const NewGame: React.FC<AllProps> = ({ onClick }) => (
  <button onClick={onClick}>New Game</button>
);

export default connect(
  undefined,
  mapDispatchToProps
)(NewGame);
