import React from 'react'
import { connect } from 'react-redux'
import { afIncrementCounter, afClearActionLog } from '../../redux.js'
import { afAsyncIncrementCounter } from '../../sagas/incrementAsync.js'
import { afRetrieveHi } from '../../sagas/retrieve-hi.js'
import { afReplayActions } from '../../sagas/replay-saga.js'
import { afConnectToWebsocket } from '../../sagas/connect-to-websocket.js'
import './counter.css'

const Counter = ({
  counter,
  heartbeats,
  onClick,
  onClickAsync,
  onClick2,
  replay,
  clearLog,
  connectToWebsocket,
}) => (
  <div className="counter">
    <div className="counterText">{counter}</div> clicks
    <div className="buttons">
      <button onClick={onClick} className="button">inc!</button>
      <button onClick={onClickAsync} className="button">inc async!</button>
      <button onClick={onClick2} className="button">request hi</button>
      <button onClick={replay} className="button">Replay</button>
      <button onClick={clearLog} className="button">Clear Log</button>
      <button onClick={connectToWebsocket} className="button">WS Connect</button>
    </div>
    {
      (heartbeats > 0) &&
      <div>
        <div className="counterText">{heartbeats}</div>
        heartbeats. (They&#39;re kinda like clicks)
      </div>
    }
  </div>

)
const mapStateToProps = ({counter, heartbeats}) => ({
  counter,
  heartbeats,
})

const mapDispatchToProps = (dispatch) => ({
  onClick: () => dispatch(afIncrementCounter()),
  onClickAsync: () => dispatch(afAsyncIncrementCounter()),
  onClick2: () => dispatch(afRetrieveHi()),
  replay: () => dispatch(afReplayActions()),
  clearLog: () => dispatch(afClearActionLog()),
  connectToWebsocket: () => dispatch(afConnectToWebsocket()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter)
