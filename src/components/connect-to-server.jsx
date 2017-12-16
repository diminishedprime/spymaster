import React from 'react'
import R from 'ramda'
import {
  connect,
} from 'react-redux'
import {
  afConnectToServer,
  afUpdateServerAddress,
} from './../redux/actions.js'
import {
  serverAddressPath,
  connectedPath,
} from './../redux/paths.js'

const mapStateToProps = (state) => ({
  serverAddress: R.view(serverAddressPath, state),
  connected: R.view(connectedPath, state),
})

const mapDispatchToProps = (dispatch) => ({
  connectToServer: (serverAddress) => () => dispatch(afConnectToServer(serverAddress)),
  onChange: ({target: {value}}) => dispatch(afUpdateServerAddress(value))
})

const ConnectToServer = ({connectToServer, serverAddress, onChange}) => (
  <div>
    Server:<input value={serverAddress}
                  onChange={onChange}
    />
    <button onClick={connectToServer(serverAddress)}>Connect</button>
  </div>
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectToServer)
