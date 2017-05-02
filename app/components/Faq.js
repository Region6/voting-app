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
import Divider from 'material-ui/Divider'
import {List, ListItem} from 'material-ui/List'
import ActionDone from 'material-ui/svg-icons/action/done'
import Typography from './Typography'
import { authorize } from './authorize.hoc'
import cs from '../styles/pages/_home.scss'

@inject("store") @observer
export default class Faq extends Component {
  static fetchData({ store }) {

  }

  static propTypes = {
    store: React.PropTypes.object,
    match: React.PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    muiTheme: PropTypes.object.isRequired,
  };

  componentWillMount = () => {
    const { store } = this.props
    store.inFaq = true
    store.setExcludePage(true)
  }

  componentWillUnmount() {
    const { store } = this.props
    store.inFaq = false
    store.setExcludePage(false)
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
    const { muiTheme } = this.context

    return (
      <Box col={12} p={1} className={cs.mainContainer}>
        <Card>
          <CardHeader
            title="Help"
            subtitle="Frequently asked questions"
          />
          <CardText>
            <Card
              initiallyExpanded={store.currentPath === "General"}
            >
              <CardHeader
                title="General"
                actAsExpander={true}
                showExpandableButton={true}
              />
              <CardText expandable={true}>
                <Typography type={"body1"}>
                  <ul>
                    <li>You will need your Badge which contains your Registrant ID and 4 digit pin.</li>
                    <li>You will need your 6 or 8 digit VPPPA Member number. If you do not know your number you can contact your site representative or visit the Registration Desk starting at 7:30 a.m. Wednesday May 3rd.</li>
                    <li>Only one management and one non-management vote will be recorded for each VPPPA association full member site.</li>
                    <li>Coordinate with your co-workers to assign voting representatives.</li>
                    <li>Voting will also be available onsite Wednesday May 3rd 7:30 - 10:30 a.m. in the Governor's Hall</li>
                    <li><a target="_blank" href="http://www.vpppa.org/membership/membership-member-center">More information about VPPPA Membership types</a></li>
                  </ul>
                </Typography>
                <br />
                <Divider />
                <br />
                <Typography type={"headline"}>
                  Example Badge
                </Typography>
                <div
                  className={cs.barcode}
                />
              </CardText>
            </Card>

            <Card
              initiallyExpanded={store.currentPath === "States"}
            >
              <CardHeader
                title="Eligible States"
                actAsExpander={true}
                showExpandableButton={true}
              />
              <CardText expandable={true}>
                  <p>
                  You must be part of the association with Full Member status who participates in a worksite located in the Region VI area, whose membership is in good standing to vote. The Region VI area is defined as New Mexico, Oklahoma, Texas, Arkansas, and Louisiana.
                  </p>
                  <p>
                  <a target="_blank" href="http://www.vpppa.org/membership/membership-member-center">More information about VPPPA Membership types</a>
                  </p>
              </CardText>
            </Card>

            <Card
              initiallyExpanded={store.currentPath === "Login"}
            >
              <CardHeader
                title="Voter Verification"
                actAsExpander={true}
                showExpandableButton={true}
              />
              <CardText expandable={true}>
                <Typography type={"title"}>
                  Registrant ID
                </Typography>
                <p>
                  Enter your unique Registrant ID which can be found on your badge above the barcode. It will start with the letter G or E and is a 6 digit alphanumeric. See example badge below.
                </p>
                <br />
                <Divider />
                <br />
                <Typography type={"title"}>
                  Pin
                </Typography>
                <p>
                  Enter your unique pin code which can be found on your badge above the barcode. It will be a 4 digit number. See example badge below.
                </p>
                <br />
                <Divider />
                <br />
                <div
                  className={cs.barcode}
                />
              </CardText>
            </Card>

            <Card
              initiallyExpanded={store.currentPath === "Site"}
            >
              <CardHeader
                title="Enter Membership Number"
                actAsExpander={true}
                showExpandableButton={true}
              />
              <CardText expandable={true}>
                <Typography type={"body1"}>
                  <ul>
                    <li>Enter your 6 or 8 digit membership number</li>
                    <li>Once you finish entering the number it will be automatically verified</li>
                    <li>If it is a valid membership number the site information will be displayed and you will be allowed to continue the voting process</li>
                    <li>Reasons a membership number cannot be verified: incorrect length, contains letters or does not include the required leading zeros</li>
                  </ul>
                </Typography>
              </CardText>
            </Card>

            <Card
              initiallyExpanded={store.currentPath === "Sites"}
            >
              <CardHeader
                title="Browse Sites"
                actAsExpander={true}
                showExpandableButton={true}
              />
              <CardText expandable={true}>
                <Typography type={"title"}>
                  Membership clarification
                </Typography>
                <p>
                  If your work site is not currently in this list you can clarify if you are part of the association with Full Member status in the Region VI area by coming to the registration area starting at 7:30 a.m. Wednesday May 3rd.
                </p>
                <br />
                <Divider />
                <br />
                <Typography type={"title"}>
                  Filtering the list
                </Typography>
                <p>
                  You can filter the list by typing a site name into the input box. It will automatically filter the list as you type.
                </p>
                <br />
                <Divider />
                <br />
                <Typography type={"title"}>
                  Show all sites
                </Typography>
                <p>
                  You can show all sites by clicking the button "Show All"
                </p>
                <br />
                <Divider />
                <br />
                <Typography type={"title"}>
                  Starting the voting process
                </Typography>
                <p>
                  You can start the voting process by clicking the button "Start Vote"
                </p>
              </CardText>
            </Card>

            <Card
              initiallyExpanded={store.currentPath === "Type"}
            >
              <CardHeader
                title="Voter Type"
                actAsExpander={true}
                showExpandableButton={true}
              />
              <CardText expandable={true}>
                <Typography type={"body1"}>
                  <ul>
                    <li>Only one management and one non-management vote is allowed per eligible site</li>
                    <li>If a voter type is disabled it is because a voter from your site of that type has already voted. The name of the voter and time vote as cast will be displayed. Who they voted for will not be displayed</li>
                    <li>If both voter types are disabled then you will be unable to cast a vote</li>
                  </ul>
                </Typography>
              </CardText>
            </Card>
          </CardText>
          <CardActions>
            <RaisedButton
              primary
              label="Previous" 
              onTouchTap={((...args) => this.goPrevious(...args))}
            />
          </CardActions>
        </Card>
      </Box>
    )
  }

}