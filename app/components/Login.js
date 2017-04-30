import React, { Component, PropTypes } from 'react'
import { observable } from 'mobx'
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
import Typography from './Typography'
import { authorize } from './authorize.hoc'
import cs from '../styles/pages/_home.scss'

@inject("store")
@observer
export default class Login extends Component {
  @observable errorRegistrantId = null
  @observable errorPin = null

  static fetchData({ store }) {
  }

  static propTypes = {
    store: React.PropTypes.object,
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
    muiTheme: PropTypes.object.isRequired,
  }

  componentWillMount() {
    const { store } = this.props
    store.setExcludePage(true)
  }

  componentWillUnmount() {
    const { store } = this.props
    store.setExcludePage(false)
  }

  handleChange = (field, event) => {
    const { store } = this.props
    store.updateField(field, event.target.value)
  }

  handleNavigate = (path) => {
    const { router } = this.context
    if ('history' in router) {
      router.history.push(path)
    } else {
      router.push(path)
    }
    
  }

  browse = () => {
    const { store } = this.props
    store.updateField('authException', true)
    this.handleNavigate('/sites')
  }

  checkIfComplete = () => {
    let retVal = false
    const { store } = this.props
    if (store.registrantId.length > 0 && store.pin.length > 0) {
      retVal = true
    }

    return retVal
  }

  async verifyRegistrant() {
    const errorText = 'Your Registrant ID and/or Pin is incorrect'
    const { store } = this.props
    const confirmed = await store.confirmRegistrant()
    if (confirmed) {
      this.errorRegistrantId = null
      this.errorPin = null
      this.handleNavigate('/site')
    } else if (store.alreadyVoted) {
      this.handleNavigate('/invalid')
    } else {
      this.errorRegistrantId = errorText
      this.errorPin = errorText
    }
  }

  render() {
    const { store } = this.props
    return (
      <Flex wrap className={cs.mainContainer}>
        <Box col={12} lg={6} md={12} sm={12} p={1}>
          <Card>
            <CardText>
              <TextField
                autoFocus
                fullWidth
                id="registrantId"
                floatingLabelText="Registrant ID"
                hintText="Enter Registrant ID Here"
                value={store.registrantId}
                onChange={((...args) => this.handleChange('registrantId', ...args))}
                errorText={this.errorRegistrantId}
              />
              <br />
              <TextField
                fullWidth
                id="pin"
                floatingLabelText="Pin"
                hintText="Enter PIN"
                type="tel"
                value={store.pin}
                onChange={((...args) => this.handleChange('pin', ...args))}
                errorText={this.errorPin}
              />

              <div
                className={cs.barcode}
              />
            </CardText>
            <CardActions>
              <RaisedButton
                primary
                disabled={!this.checkIfComplete()}
                label="Next"
                onTouchTap={((...args) => this.verifyRegistrant(...args))}
              />
            </CardActions>
          </Card>
        </Box>
        <Box col={12} lg={6} md={12} sm={12} p={1}>
          <Card>
            <CardText>
              <Box col={12} p={1}>
                <RaisedButton
                  label="Browse Eligible Sites"
                  secondary 
                  onTouchTap={((...args) => this.browse(...args))}
                />
              </Box>
            </CardText>
          </Card>
        </Box>
      </Flex>
    )
  }

}