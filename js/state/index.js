import { observable, computed, toJS, action, extendObservable } from 'mobx'
import { RouterStore } from 'mobx-router'
import NotificationStore from './notification'

class AppStore extends NotificationStore {

  constructor (views) {
    super()
    this.commentPageSize = 2
    this.replyPageSize = 2
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

  @action showDashboard() {
    this.cv = observable({
      myproposals: null,
      justsupported: null,
      ready4voting: null
    })
    if (this.loggedUser !== null) {
      this.requester.call(`/proposals?uid=${this.loggedUser.id}&status=draft`)
      .then((res) => {
        res.data.map((i) => this.loadUserInfo(i.uid)) // load userinfos
        this.cv.myproposals = res.data
      })
      .catch(this.onError.bind(this))
    }

    this.requester.call(`/proposals?status=voting`)
    .then((res) => {
      const data = res.data.filter(this.isInMyGroups.bind(this))
      data.map((i) => this.loadUserInfo(i.uid)) // load userinfos
      this.cv.ready4voting = data
    })
    .catch(this.onError.bind(this))

    this.requester.call(`/proposals?status=thinking`)
    .then((res) => {
      const data = res.data.filter(this.isInMyGroups.bind(this))
      data.map((i) => this.loadUserInfo(i.uid)) // load userinfos
      this.cv.justsupported = data
    })
    .catch(this.onError.bind(this))
  }

  @action goToDetail(id) {
    this.router.goTo(this.views.proposal, {id}, this, {_page: 1})
  }

  @action goTo(viewname, params={}, query = {}) {
    this.router.goTo(this.views[viewname], params, this, query)
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
    if (err.response && err.response.status === 401) {
      return this.goTo('login')
    }
    throw err
  }

}

export default AppStore
