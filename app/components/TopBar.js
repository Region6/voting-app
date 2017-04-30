import React, { Component, PropTypes } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'

import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import ActionHelp from 'material-ui/svg-icons/action/help'
import NavigationCancel from 'material-ui/svg-icons/navigation/cancel'
import FlatButton from 'material-ui/FlatButton'
import { Box } from 'reflexbox'
import Button from './ui/Button'

const styles = {
  title: {
    cursor: 'pointer',
  },
};

@inject("store") @observer
export default class TopBar extends Component {

  static propTypes = {
    store: React.PropTypes.object,
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
    muiTheme: PropTypes.object.isRequired,
  }

  handleTitleTap = () => {
    this.navigate('/')
  }

  handleHelpTap = () => {
    const { store } = this.props
    if (store.inFaq) {
      this.goPrevious()
    } else {
      const location = window.location.pathname.replace('/', '')
      store.setCurrentPath(location)
      this.navigate('/faq')
    }
  }

  goPrevious = () => {
    const { router } = this.context
    const { store } = this.props
    store.inFaq = false
    if ('history' in router) {
      router.history.goBack()
    } else {
      router.goBack()
    }
  }

  navigate = (path) => {
    const { router } = this.context
    if ('history' in router) {
      router.history.push(path)
    } else {
      router.push(path)
    }
  }

  render() {
    const { store } = this.props
    return (
      <Box col={12}>
        <AppBar
          showMenuIconButton={false}
          title={<span style={styles.title}>Voting</span>}
          onTitleTouchTap={this.handleTitleTap}
          iconElementRight={
            <IconButton onTouchTap={this.handleHelpTap}>
              {store.inFaq && <NavigationCancel />}
              {!store.inFaq && <ActionHelp />}
            </IconButton>
          }
        />
      </Box>
    )
  }

}