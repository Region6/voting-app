import React, { Component, PropTypes } from 'react'
import { observable, autorun } from 'mobx'
import { BrowserRouter as Router } from 'react-router-dom'
import { Route, Redirect, Switch } from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'
import { Provider, observer } from 'mobx-react'
import DevTools from 'mobx-react-devtools'
import { Flex, Box } from 'reflexbox'
import IdleTimer from 'react-idle-timer'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Toggle from 'material-ui/Toggle'
import {List, ListItem} from 'material-ui/List'
import Typography from './Typography'
import ReactCountdownClock from 'react-countdown-clock'

import Faq from './Faq'
import Finish from './Finish'
import Invalid from './Invalid'
import Login from './Login'
import Office from './Office'
import Review from './Review'
import Site from './Site'
import Sites from './Sites'
import Start from './Start'
import States from './States'
import TopBar from './TopBar'
import Type from './Type'
import Voter from './Voter'

const history = createBrowserHistory()
const styles = {
  container: {
    height: '100%'
  }
}

@observer
export default class App extends Component {
  @observable idleTimer = null
  @observable router = null
  @observable dialogOpen = false
  @observable port
  @observable ports = []

  componentDidMount() {
    const { store } = this.props
    const self = this

    autorun(() => {
      if (store.registrantId && store.alreadyVoted) {
        self.navigate('/invalid')
      } else if (store.voter) {
        self.navigate('/site')
      }
    })
  }

  onActive = () => {
    console.log('activity detected')
    this.idleTimer.reset()
  }

  onIdle = () => {
    const { store } = this.props
    if (!store.excludePage) {
      console.log('app is idle')
      this.dialogOpen = true
    } else {
      this.idleTimer.reset()
    }
  }

  handleOpen = () => {
    this.dialogOpen = true
  }

  handleDone = () => {
    this.dialogOpen = false
    this.handleNavigate('/reset')
  }

  handleSerialDone = () => {
    const { store } = this.props
    store.serialDialogOpen = false
  }

  handleSerialCancel = () => {
    const { store } = this.props
    store.serialDialogOpen = false
  }

  handleMoreTime = () => {
    this.dialogOpen = false
    this.idleTimer.reset()
  }

  goBegin = () => {
    const { store } = this.props
    this.dialogOpen = false
    store.reset()
    this.handleNavigate('/reset')
  }

  navigate = (path) => {
    const { router } = this
    if ('history' in router) {
      router.history.push(path)
    } else {
      router.push(path)
    }
  }

  handleNavigate = (path) => {
    const { router } = this.props
    if ('history' in router) {
      router.history.push(path)
    } else {
      router.push(path)
    }
  }

  render() {
    const { store } = this.props
    const actions = [
      <FlatButton
        label="I'm done voting"
        onTouchTap={this.handleDone}
      />,
      <FlatButton
        label="I need more time!"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleMoreTime}
      />,
    ]
    const serialActions = [
      <FlatButton
        label="Cancel"
        onTouchTap={this.handleSerialCancel}
      />,
      <FlatButton
        label="Select"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleSerialDone}
      />,
    ]
    let timeoutSeconds = 30

    return (
      <IdleTimer
        ref={(timer) => { this.idleTimer = timer }}
        element={document}
        activeAction={this.onActive}
        idleAction={this.onIdle}
        timeout={store.timeout}
        format="MM-DD-YYYY HH:MM:ss.SSS">
        <div style={styles.container}>
          <Router
            history={history}
            ref={(router) => { this.router = router }}
          >
            <Provider store={store}>
              <Flex
                column
                style={{ height: '100%', minHeight: 0 }}
              >
                {/*<DevTools />*/}
                <TopBar />
                <Switch>
                  <Route
                    path="/states"
                    component={States}
                  />
                  <Route
                    path="/login"
                    component={Login}
                  />
                  <Route
                    path="/site"
                    component={Site}
                  />
                  <Route
                    path="/sites"
                    component={Sites}
                  />
                  <Route
                    path="/voter"
                    component={Voter}
                  />
                  <Route
                    path="/type"
                    component={Type}
                  />
                  <Route
                    path="/office/:id"
                    component={Office}
                  />
                  <Route
                    path="/review"
                    component={Review}
                  />
                  <Route
                    path="/finish"
                    component={Finish}
                  />
                  <Route
                    path="/faq"
                    component={Faq}
                  />
                  <Route
                    path="/invalid"
                    component={Invalid}
                  />
                  <Route
                    path="/reset"
                    render={(state) => {
                      // seems ok ?
                      return <Redirect 
                        to="/"
                      />
                    }}
                  />
                  <Route
                    path="/"
                    component={Start}
                  />
                </Switch>
              </Flex>
            </Provider>
          </Router>
          <Dialog
            title="Timeout"
            actions={actions}
            modal={false}
            open={this.dialogOpen}
            onRequestClose={this.handleDone}
          >
            <Flex>
              <Box col={6}>
                Your session will timeout in {timeoutSeconds} second(s)
              </Box>
              <Box col={6}>
                <ReactCountdownClock 
                  seconds={timeoutSeconds}
                  color="#000"
                  alpha={0.9}
                  size={50}
                  onComplete={this.goBegin} 
                />
              </Box>
            </Flex>
          </Dialog>
          <Dialog
            title="Barcode Scanners..."
            actions={serialActions}
            modal={false}
            open={store.serialDialogOpen}
            onRequestClose={this.handleSerialDone}
          >
            <List>
              {store.ports.map((port) =>
                <ListItem
                  key={port.device} primaryText={port.name}
                  rightToggle={
                    <Toggle
                      toggled={(port.device === store.db.scanner.port)}
                      onToggle={((...args) => store.setPort(port, ...args))}
                    />
                  } 
                />
              )}
            </List>
          </Dialog>
        </div>
      </IdleTimer>
    )
  }
}