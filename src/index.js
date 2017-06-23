import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/app/app.jsx'
import registerServiceWorker from './registerServiceWorker'
import { Provider } from 'react-redux'
import { store } from './redux.js'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
