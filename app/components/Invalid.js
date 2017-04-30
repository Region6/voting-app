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
export default class Invalid extends Component {

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

    setTimeout(() => this.navigate('/'), 25000)
  }

  componentWillUnmount() {
    const { store } = this.props
    store.setExcludePage(false)
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
            title={"Voting is not available"}
          />
          <CardText>
            <Box col={12} p={1}>
              <Typography type={"headline"}>
                {store.alreadyVoted &&
                  <div>You have already voted</div>
                }
                {!store.isAfterStart() && !store.alreadyVoted &&
                  <div>Voting has not started yet</div>
                }
                {!store.isBeforeEnd() && !store.alreadyVoted &&
                  <div>Voting has ended</div>
                }
              </Typography>
              </Box>
          </CardText>
        </Card>
      </Box>
    )
  }

}