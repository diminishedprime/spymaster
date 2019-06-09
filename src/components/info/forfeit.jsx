import React from "react";
import R from "ramda";
import { connect } from "react-redux";

import { afForfeit } from "../../redux/actions";
import { teamPath } from "../../redux/paths";

const Forfeit = connect(
  state => ({ team: R.view(teamPath, state) }),
  dispatch => ({
    forfeit: team => () => dispatch(afForfeit(team))
  })
)(({ team, forfeit }) => <button onClick={forfeit(team)}>Forfeit</button>);

export default Forfeit;
