import { observable, action } from 'mobx'
import axios from 'axios'
import moment from 'moment'
import uuid from 'uuid'
import settings from '../../config'

const url = settings.checkinServerUrl

class AppState {
  @observable authException = false
  @observable voter = null
  @observable companies = []
  @observable offices = []
  @observable votes = []
  @observable voteResults = null
  @observable alreadyVoted = false
  @observable registrantId = ""
  @observable pin = ""
  @observable pinConfirmed = false
  @observable siteId = ""
  @observable site = null
  @observable search = ""
  @observable type = null
  @observable edit = false
  @observable timeout = 60000
  @observable excludePage = false
  @observable currentPath = "General"
  @observable inFaq = false

  constructor() {
    this.fetchOffices()
  }

  @action async fetchOffices() {
    let {data} = await axios.get(`${url}/api/offices`)
    if (data.length > 0) {
      this.offices = data
    }
  }

  @action async getRegistrant() {
    let retVal
    try {
      let { data } = await axios.get(`${url}/api/voter/${this.registrantId}`)
      if (data) {
        this.voter = data
      }
      retVal = data
    } catch(e) {
      console.log(e)
      this.alreadyVoted = true
      retVal = e
    } 
    return retVal
  }

  @action async getRegistrantPin() {
    let retVal
    try {
      let {data} = await axios.get(`${url}/api/voter/${this.registrantId}/pin/${this.pin}`)
      
      if ("id" in data) {
        this.pinConfirmed = true
        this.authException = false
        if (!this.siteId) {
          this.siteId = (this.voter.siteId) ? this.voter.siteId : ""
          if (this.siteId) {
            const site = await this.getSite()
          }
        }
      }
      retVal = true
    } catch(e) {
      console.log(e)
      this.authException = true
      retVal = null
    } 
    return retVal
  }

  @action async confirmRegistrant() {
    let pin = false
    const registrant = await this.getRegistrant()
    if (registrant.id) {
      this.voter = registrant
      pin = await this.getRegistrantPin()
    }

    return pin
  }

  @action async getAllSites() {
    this.search = ""
    let {data} = await axios.get(`${url}/api/votingSites`)
    console.log(data)
    this.companies = data
    return data
  }

  @action async searchCompanies(search) {
    const query = (search) ? search : this.search
    let {data} = await axios.get(`${url}/api/votingSite/${query}`)
    console.log(data)
    this.companies = data
    return data
  }

  @action async searchSiteIds(search) {
    const query = (search) ? search : this.siteId
    let {data} = await axios.get(`${url}/api/siteid/?search=${query}`)
    console.log(data)
    this.companies = data
    return data
  }

  @action async getSite() {
    let {data} = await axios.get(`${url}/api/site/${this.siteId}`)
    console.log(data)
    if (data && data.id > 0) {
      this.site = data
    } else {
      this.site = null
    }
    return this.site
  }

  @action async selectSite(siteId) {
    let {data} = await axios.get(`${url}/api/site/${siteId}`)
    console.log(data)
    if (data && data.id > 0) {
      this.siteId = siteId
      this.site = data
    } else {
      this.site = null
    }
    return this.site
  }

  @action updateField(field, value) {
    this[field] = value;
  }

  @action authenticate() {
    let retVal = false
    if (this.authException) {
      retVal = true
    } else {
      retVal = (this.voter) ? this.voter : false
    }
    return retVal
  }

  getVote(electionId) {
    let retVal = null
    const idx = this.votes.findIndex(vote => vote.electionid == electionId)
    if (idx > -1) {
      retVal = this.votes[idx]
    } 

    return retVal
  }

  @action updateVote(office, candidate) {
    let vote = {}
    const idx = this.votes.findIndex(vote => vote.electionid == office.id)
    const prefix = this.voter.badge_prefix
    const regId = `${prefix}${this.voter.id.toString().padStart(5, '0')}`
    if (idx > -1) {
      vote = this.votes[idx]
      const newVote = {
        siteid: this.siteId,
        registrantid: regId,
        electionid: office.id,
        candidateid: candidate.id,
        votertype: this.type,
        datecast: moment().format('YYYY-MM-DD HH:mm:ss'),
      }
      this.votes[idx] = Object.assign({}, vote, newVote);
    } else {
      vote = {
        uuid: uuid.v1(),
        siteid: this.siteId,
        registrantid: regId,
        electionid: office.id,
        candidateid: candidate.id,
        votertype: this.type,
        datecast: moment().format('YYYY-MM-DD H:mm:ss'),
      }
      this.votes.push(vote)
    }
    console.log(vote)
    
    return vote
  }

  @action async castVote() {
    let {data} = await axios.post(
      `${url}/api/castVote`,
      {
        votes: this.votes
      }
    )
    console.log(data)
    if (data) {
      this.voteResults = data
    }
    return this.voteResults
  }

  checkIfTypeVoted(type) {
    const voter = this.site.voters.find(vote => vote.voterType == type)
    return voter
  }

  @action reset() {
    this.voter = null
    this.companies = []
    this.offices = []
    this.votes = []
    this.registrantId = ""
    this.pin = ""
    this.pinConfirmed = false
    this.siteId = ""
    this.site = null
    this.search = ""
    this.type = null
    this.edit = false
    this.alreadyVoted = false
    this.voteResults = null
    this.startPage = false
    return
  }

  isAfterStart() {
    return moment().isAfter(settings.start)
  }

  isBeforeEnd() {
    return moment().isBefore(settings.end)
  }
  
  isActive() {
    return this.isAfterStart() && this.isBeforeEnd()
  }

  @action setExcludePage(value) {
    this.excludePage = value
    return this.excludePage
  }

  @action setCurrentPath(path) {
    if (path === "") {
      this.currentPath = "General"
    } else {
      this.currentPath = path.replace(/\b\w/g, l => l.toUpperCase())
    }
  }
}

export default AppState;