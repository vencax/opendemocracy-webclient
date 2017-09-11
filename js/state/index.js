import { observable, computed, toJS, action, transaction, extendObservable, asMap } from 'mobx'
import { RouterStore } from 'mobx-router'

import DataRequester from '../services/requester'
import AuthStore from './auth'

class AppStore extends AuthStore {

  constructor (views) {
    super()
    this.commentPageSize = 2
    this.replyPageSize = 2
    // create requester
    const getAuthHeaders = this.getAuthHeaders.bind(this)
    this.requester = new DataRequester(Conf.apiUrl, getAuthHeaders, {})
    // create router
    this.router = new RouterStore()
    this.views = views
  }

  get cv() {
    return this.currentView
  }
  set cv(instance) {
    this.currentView = instance
  }
  __ (str) {
    return str
  }

  @action showDashboard() {
    this.cv = observable({
      discussions: []
    })
    this.loadDiscussions(this.cv, {entityname: 'proposals'})
    .catch(this.onError.bind(this))
  }

  @action showProposal(id) {
    this.cv = observable({
      discussion: null,
      discussionid: id
    })
    this.loadDiscussion(this.cv, id, {entityname: 'proposals'})
    .catch(this.onError.bind(this))
  }

  @action goToDetail(id) {
    this.router.goTo(this.views.proposal, {id}, this)
  }

  @action goTo(viewname) {
    this.router.goTo(this.views[viewname], {}, this)
  }

  messages = observable.shallowMap({})
  @observable loggedUser = null

  @action addMessage(text, type, timeout = 0) {
    const message = {text, type, timeout}
    this.messages.set(text, message)
    if(timeout > 0) {
      function _remove() {
        this.messages.delete(text)
      }
      setTimeout(_remove.bind(this), timeout)
    }
    return message
  }

  @action removeMessage(message) {
    this.messages.delete(message.text)
  }

  onError(err) {
    if (err.response.status === 401) {
      this.goTo('login')
    }
  }

}

export default AppStore
