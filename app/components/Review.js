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
import ActionDone from 'material-ui/svg-icons/action/done';
import Typography from './Typography'
import { authorize } from './authorize.hoc'
import cs from '../styles/pages/_home.scss'

let offices = []
const styles = {
  block: {
    maxWidth: 250,
  },
  radioButton: {
    marginBottom: 16,
  },
}

const getOffice = (officeId) => {
  const idx = offices.findIndex(o => o.id == officeId)
  return offices[idx]
}

const getOfficeCandidate = (officeId, candidateId) => {
  const office = getOffice(officeId)
  const idx = office.Candidates.findIndex(c => c.id == candidateId)
  return office.Candidates[idx]
}

const RenderVote = (vote, onSelect) => (
  <ListItem
    key={vote.uuid}
    leftIcon={<ActionDone />}
    primaryText={getOffice(vote.electionid).title}
    secondaryTextLines={1}
    onTouchTap={((...args) => onSelect(vote, ...args))}
    secondaryText={getOfficeCandidate(vote.electionid, vote.candidateid).name}
  />
)

const RenderVotes = ({votes, onSelect}) => (
  <List>
    {votes.map((vote) => RenderVote(vote, onSelect))}
  </List>
)

@inject("store") @authorize @observer
export default class Review extends Component {
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

  async handleNext() {
    const { store } = this.props
    const results = await store.castVote()
    let path = '/finish'
    this.navigate(path)
  }

  selectVote = (vote) => {
    const { store } = this.props
    const { router } = this.context
    const idx = store.votes.findIndex(r => r.uuid === vote.uuid)
    store.updateField('edit', true)
    setTimeout(() => this.navigate('/office/'+idx.toString()), 500)
  }

  goPrevious = () => {
    const { router } = this.context
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
    offices = store.offices

    return (
      <Box col={12} p={1} className={cs.mainContainer}>
        <Card>
          <CardHeader
            title="Review Vote(s)"
            subtitle="Click/Tap vote to change"
          />
          <CardText>
            {store.votes.length > 0 &&
              <RenderVotes votes={store.votes} onSelect={this.selectVote} />
            }
          </CardText>
          <CardActions>
            <RaisedButton
              label="Previous" 
              onTouchTap={((...args) => this.goPrevious(...args))}
            />
            <RaisedButton
              primary
              label="Cast Vote(s)"
              onTouchTap={((...args) => this.handleNext(...args))}
            />
          </CardActions>
        </Card>
      </Box>
    )
  }

}