import React, { Component, PropTypes } from 'react'
import { inject, observer } from 'mobx-react'
import { Flex, Box } from 'reflexbox'
import {
  Card,
  CardActions,
  CardMedia,
  CardHeader,
  CardText
} from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {List, ListItem} from 'material-ui/List'
import Typography from './Typography'
import cs from '../styles/pages/_home.scss'

const styles = {
  showAll: {
    marginLeft: '10px'
  }
} 

@inject("store") @observer
export default class States extends Component {

  static propTypes = {
    store: React.PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    muiTheme: PropTypes.object.isRequired,
  };

  componentWillMount() {
    const { store } = this.props
    store.setExcludePage(true)
  }

  componentWillUnmount() {
    const { store } = this.props
    store.setExcludePage(false)
  }

  select = (state, event) => {
    const { store } = this.props
    this.handleNavigate('/login')
  }

  handleNavigate = (path) => {
    const { store } = this.props
    const { router } = this.context
    if (store.isActive()) {
      this.navigate(path)
    } else {
      this.navigate('/invalid')
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
    const { muiTheme } = this.context
    return (
      <Box col={12} p={1} className={cs.mainContainer}>
        <Card>
          <CardHeader
            title="Eligible States"
            subtitle="Select your work site state from the list below"
          />
          <CardText>
            <Box col={12} p={1}>
              <List>
                <ListItem
                  primaryText={'Arkansas'}
                  onTouchTap={((...args) => this.select('Arkansas', ...args))}
                />
                <ListItem
                  primaryText={'Louisiana'}
                  onTouchTap={((...args) => this.select('Louisiana', ...args))}
                />
                <ListItem
                  primaryText={'New Mexico'}
                  onTouchTap={((...args) => this.select('New Mexico', ...args))}
                />
                <ListItem
                  primaryText={'Oklahoma'}
                  onTouchTap={((...args) => this.select('Oklahoma', ...args))}
                />
                <ListItem
                  primaryText={'Texas'}
                  onTouchTap={((...args) => this.select('Texas', ...args))}
                />
              </List>
            </Box>
          </CardText>
        </Card>
      </Box>
    )
  }

}