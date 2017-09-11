import { observable, computed, toJS, action, transaction, extendObservable, asMap } from 'mobx'
import { RouterStore } from 'mobx-router'

import DataRequester from '../services/requester'
import CommentsStateInit from 'fb-similar-discussions/state'

class BaseStore {

  constructor (views) {
    this.commentPageSize = 2
    this.replyPageSize = 2
    // create requester
    this.requester = new DataRequester(Conf.apiUrl, () => {
      return
    }, {})
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

  @action showLogin() {
    this.cv = observable({
      submitted: false,
      error: false,
      uname: '',
      passw: ''
    })
  }

  @action performLogin() {
    this.cv.submitted = true
    this.requester.call('/login', 'POST', {
      username: this.cv.uname,
      password: this.cv.passw
    })
    .then((res) => {
      this.cv.submitted = false
      this.loggedUser = observable(res.data.user)
    })
    .catch((err) => {
      this.error = err
      this.cv.submitted = false
    })
  }

  __ (str) {
    return str
  }

  @action showDashboard() {
    this.cv = observable({
      discussions: []
    })
    this.loadDiscussions(this.cv, {entityname: 'proposals'})
  }

  @action showProposal(id) {
    this.cv = observable({
      discussion: null,
      discussionid: id
    })
    this.loadDiscussion(this.cv, id, {entityname: 'proposals'})
  }

  @action goToDetail(id) {
    this.router.goTo(this.views.proposal, {id}, this)
  }

  @action goTo(viewname) {
    this.router.goTo(this.views[viewname], {}, this)
  }

  getLoggedUserId() {
    return 3
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

}

export default CommentsStateInit(BaseStore)
