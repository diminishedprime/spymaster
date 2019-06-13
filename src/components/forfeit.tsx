import React from "react";
import * as t from "./../types";
import R from "ramda";
import { connect } from "react-redux";

import { afForfeit } from "./../redux/actions";
import { teamPath } from "./../redux/paths";

interface StateProps {
  team: t.Team;
}

interface DispatchProps {
  forfeit: (team: t.Team) => () => void;
}

type AllProps = StateProps & DispatchProps;

const Forfeit: React.FC<AllProps> = ({ team, forfeit }) => {
  return <button onClick={forfeit(team)}>Forfeit</button>;
};

export default connect(
  (state: t.ReduxState): StateProps => {
    return { team: R.view(teamPath, state) };
  },
  (dispatch: t.Dispatch): DispatchProps => {
    return {
      forfeit: team => {
        return () => {
          return dispatch<t.Forfeit>(afForfeit(team));
        };
      }
    };
  }
)(Forfeit);
