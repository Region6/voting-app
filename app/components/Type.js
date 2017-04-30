import React, { Component, PropTypes } from 'react'
import { observable } from 'mobx'
import { inject, observer } from 'mobx-react'
import moment from 'moment'
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
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import Typography from './Typography'
import { authorize } from './authorize.hoc'
import cs from '../styles/pages/_home.scss'

const styles = {
  block: {
    maxWidth: 250,
  },
  radioButton: {
    marginBottom: 16,
  },
}

@inject("store") @authorize @observer
export default class Type extends Component {
  @observable management = null
  @observable nonmanagement = null

  static fetchData({ store }) {

  }

  static propTypes = {
    store: React.PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    muiTheme: PropTypes.object.isRequired,
  };

  componentWillMount() {
    const { store } = this.props
    const { router } = this.context

    this.management = store.checkIfTypeVoted('management')
    this.nonmanagement = store.checkIfTypeVoted('non-management')
  }

  handleChange = (field, event, value) => {
    const { store } = this.props
    store.updateField(field, event.target.value);
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

  bothVoted = () => {
    let retVal = false
    if (this.nonmanagement && this.management) {
      retVal = true
    }

    return retVal
  }

  managementLabel = () => {
    let retVal
    if (this.management) {
      retVal = (
        <div>
          <div>Management</div>
          <Typography type={"body1"}>{this.management.lastname}, {this.management.firstname} has already voted</Typography>
          <Typography type={"body1"}>{(this.management) ? moment(this.management.dateCast).format('ddd MMM Do h:mm a') : null}</Typography>
        </div>
      )
    } else {
      retVal = (
        <div>
          <div>Management</div>
          <Typography type={"body1"}>This vote represents management for your site</Typography>
        </div>
      )
    }
    return retVal         
  }

  nonManagementLabel = () => {
    let retVal
    if (this.nonmanagement) {
      retVal = (
        <div>
          <div>Non-Management</div>
          <Typography type={"body1"}>{this.nonmanagement.lastname}, {this.nonmanagement.firstname} has already voted</Typography>
          <Typography type={"body1"}>{(this.nonmanagement) ? moment(this.nonmanagement.dateCast).format('ddd MMM Do h:mm a') : null}</Typography>
        </div>   
      )
    } else {
      retVal = (
        <div>
          <div>Non-Management</div>
          <Typography type={"body1"}>This vote represents non-management for your site</Typography>
        </div>
      )
    }
    return retVal         
  }

  render() {
    const { store } = this.props
    const { muiTheme } = this.context
    return (
      <Box col={12} p={1} className={cs.mainContainer}>
        <Card>
          <CardHeader
            title="Voter Type"
            subtitle="Select your voter type"
          />
          <CardText>
            
            <Box col={12} p={1}>
              <RadioButtonGroup
                name="voterType"
                defaultSelected={store.type}
                onChange={((...args) => this.handleChange('type', ...args))}>
                <RadioButton
                  disabled={(typeof this.management === 'object')}
                  value="management"
                  label={this.managementLabel()}
                  style={styles.radioButton}
                />
                <RadioButton
                  disabled={(typeof this.nonmanagement === 'object')}
                  value="non-management"
                  label={this.nonManagementLabel()}
                  style={styles.radioButton}
                />
              </RadioButtonGroup>
            </Box>
          </CardText>
          <CardActions>
            <RaisedButton
              label="Previous" 
              onTouchTap={((...args) => this.goPrevious(...args))}
            />
            {this.bothVoted() &&
              <RaisedButton
                primary
                label="Finish"
                onTouchTap={((...args) => this.handleNavigate('/reset', ...args))}
              />
            }
            {!this.bothVoted() &&
              <RaisedButton
                disabled={!store.type}
                primary
                label="Next"
                onTouchTap={((...args) => this.handleNavigate('office/0', ...args))}
              />
            }
          </CardActions>
        </Card>
      </Box>
    )
  }

}