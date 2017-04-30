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

@inject("store") @authorize @observer
export default class Site extends Component {
  @observable error = null

  static fetchData({ store }) {
    return store.getSite()
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
    if (!store.site) {
      this.setError()
    }
  }

  setError = () => {
    this.error = 'This number is not tied to an eligible voting site. Please enter an eligible number to continue.'
  }

  async handleChange(field, event) {
    const { store } = this.props
    store.updateField(field, event.target.value)
    const site =  await store.getSite()
    if (!site) {
      this.setError()
    } else {
      this.error = null
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

  goPrevious = () => {
    const { router } = this.context
    if ('history' in router) {
      router.history.goBack()
    } else {
      router.goBack()
    }
  }

  render() {
    const { store } = this.props
    const { muiTheme } = this.context
    return (
      <Box col={12} p={1} className={cs.mainContainer}>
        <Card>
          <CardText>
            <TextField
              autoFocus
              fullWidth
              id="siteId"
              floatingLabelText="Member Number (6 or 8 digits)"
              hintText="Enter Membership Number"
              type="tel"
              value={store.siteId}
              onChange={((...args) => this.handleChange('siteId', ...args))}
              errorText={this.error}
            />
            {store.site &&
              <div>
                <Typography type='title'>Selected Site</Typography>
                <Typography type='body1'>{store.site.company}</Typography>
                <Typography type='body1'>{store.site.street1}</Typography>
                <Typography type='body1'>{store.site.street2}</Typography>
                <Typography type='body1'>{store.site.city}, {store.site.state}</Typography>
              </div>
            }
          </CardText>
          <CardActions>
            <RaisedButton
              label="Previous" 
              onTouchTap={((...args) => this.goPrevious(...args))}
            />
            <RaisedButton
              primary
              disabled={!store.site}
              label="Next"
              onTouchTap={((...args) => this.handleNavigate('type', ...args))}
            />
          </CardActions>
        </Card>
      </Box>
    )
  }

}