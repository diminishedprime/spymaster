import React from "react";
import * as t from "./../types";
import { connect } from "react-redux";
import * as actions from "../redux/actions";
import * as lens from "../redux/lenses";

interface StateProps {
  team: t.Team;
}

interface DispatchProps {
  forfeit: (team: t.Team) => () => void;
}

type AllProps = StateProps & DispatchProps;

const Forfeit: React.FC<AllProps> = ({ forfeit }) => {
  const team = actions.useLens(lens.team);
  return <button onClick={forfeit(team)}>Forfeit</button>;
};

const mapDispatchToProps = (dispatch: t.Dispatch): DispatchProps => {
  return {
    forfeit: team => {
      return () => {
        return dispatch<t.Forfeit>(actions.afForfeit(team));
      };
    }
  };
};

export default connect(
  undefined,
  mapDispatchToProps
)(Forfeit);
