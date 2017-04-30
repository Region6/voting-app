import React, { Component, PropTypes } from 'react'
import { observable } from 'mobx'
import { inject, observer } from 'mobx-react'
import { Page, Row, Column } from 'hedron'
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
import cs from '../styles/pages/_home.scss'

@inject("store")
@observer
export default class Voter extends Component {
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

  checkIfComplete = () => {
    let retVal = false
    const { store } = this.props
    if (store.registrantId.length > 0 && store.pin.length > 0) {
      retVal = true
    }

    return retVal
  }

  handleChange = (field, event) => {
    const { store } = this.props
    store.updateField(field, event.target.value)
  }

  goPrevious = () => {
    const { router } = this.context
    if ('history' in router) {
      router.history.goBack()
    } else {
      router.goBack()
    }
  }

  handleNavigate = (path) => {
    const { router } = this.context
    this.navigate(path)
  }

  navigate = (path) => {
    const { router } = this.context
    if ('history' in router) {
      router.history.push(path)
    } else {
      router.push(path)
    }
  }

  async verifyRegistrant() {
    const errorText = 'Your Registrant ID and/or Pin is incorrect'
    const { store } = this.props
    const confirmed = await store.confirmRegistrant()
    if (confirmed) {
      this.errorRegistrantId = null
      this.errorPin = null
      this.handleNavigate('site')
    } else {
      this.errorRegistrantId = errorText
      this.errorPin = errorText
    }
  }

  render() {
    const { store } = this.props
    return (
      <Box col={12} p={1} className={cs.mainContainer}>
        <Card>
          <CardHeader
            title="Voter Identification"
            subtitle="Enter your Registrant ID and Pin to vote"
          />
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
              label="Previous" 
              onTouchTap={((...args) => this.goPrevious(...args))}
            />
            <RaisedButton
              primary
              disabled={!this.checkIfComplete()}
              label="Next"
              onTouchTap={((...args) => this.verifyRegistrant(...args))}
            />
          </CardActions>
        </Card>
      </Box>
    )
  }

}