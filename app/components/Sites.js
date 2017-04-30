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
import ActionCached from 'material-ui/svg-icons/action/cached'
import {List, ListItem} from 'material-ui/List'
import Typography from './Typography'
import { authorize } from './authorize.hoc'
import cs from '../styles/pages/_home.scss'

const styles = {
  showAll: {
    marginLeft: '10px'
  }
} 

const RenderSite = (site, onSelect) => (
  <ListItem
    disabled
    key={site.id}
    primaryText={site.company}
    secondaryTextLines={2}
    secondaryText={
      <div>
        <div>{site.street1}{(site.street2) ? `, ${site.street2}`: null}</div>
        <div>{site.city}, {site.state}</div>
      </div>
    }
  />
)

const RenderSites = ({sites, onSelect}) => (
  <List>
    {sites.map((site) => RenderSite(site, onSelect))}
  </List>
)

@inject("store") @observer
export default class Sites extends Component {

  static fetchData({ store }) {
    return store.post.find();
  }

  static propTypes = {
    store: React.PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    muiTheme: PropTypes.object.isRequired,
  };

  componentDidMount() {
      const { store } = this.props
      const { router } = this.context
      this.showAll()
  }

  handleChange = (field, event) => {
    const { store } = this.props
    if (!isNaN(event.target.value)) {
      store.updateField(field, event.target.value);
      store.searchSiteIds()
    } else {
      store.updateField(field, event.target.value);
      store.searchCompanies()
    }
  }

  async selectSite(site) {
    const { store } = this.props
    const path = (store.authException) ? 'voter' : 'site'
    await store.selectSite(site.siteId)
    this.handleNavigate(path)
  }

  async showAll(event) {
    const { store } = this.props
    await store.getAllSites()
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
          <CardHeader
            title="Browse Eligible Sites"
            subtitle="Only Region 6 Full Member Sites are eligible"
          />
          <CardText>
              <TextField
                autoFocus
                id="name"
                hintText="Enter site to search..."
                value={store.search}
                onChange={((...args) => this.handleChange('search', ...args))}
              /> <br />
              <RaisedButton
                icon={<ActionCached />}
                label="Show All"
                onTouchTap={((...args) => this.showAll(...args))}
              />
              {store.isActive() &&
              <RaisedButton
                label="Start Vote"
                style={styles.showAll} 
                primary
                onTouchTap={((...args) => this.handleNavigate('/login', ...args))}
              />
              }
              {store.companies.length > 0 &&
                  <RenderSites sites={store.companies} onSelect={((...args) => this.selectSite(...args))} />
              }
          </CardText>
          {store.isActive() &&
            <CardActions>
              <RaisedButton
                primary
                label="Start Vote"
                onTouchTap={((...args) => this.handleNavigate('/login', ...args))}
              />
            </CardActions>
          }
        </Card>
      </Box>
    )
  }

}