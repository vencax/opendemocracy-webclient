import { observable, computed, toJS, action, transaction, extendObservable, asMap } from 'mobx'
import CommentsStateInit from 'fb-like-discussions/state'
import AuthService from '../services/auth'

class AuthStore {

  constructor() {
    this.authService = new AuthService()
    const uinfo = this.authService.getInfo()
    this.loggedUser = uinfo ? uinfo.user: null
    this.token = uinfo ? uinfo.token: null
  }

  getAuthHeaders() {
    return this.token ? {
      'Authorization': `Bearer ${this.token}`
    } : {}
  }

  @action showLogin() {
    this.cv = observable({
      submitted: false,
      error: false,
      username: '',
      password: ''
    })
  }

  @action logout() {
    this.loggedUser = null
    this.token = null
    this.authService.logout()
    this.goTo('login')
  }

  @action handleLoginFormChange(attr, val) {
    this.cv[attr] = val
  }

  @action performLogin() {
    this.cv.submitted = true
    this.authService.login(this.cv, this.requester)
    .then((res) => {
      this.cv.submitted = false
      this.loggedUser = observable(res.user)
      this.token = res.token
      this.goTo('dashboard')
    })
    .catch((err) => {
      this.error = err
      this.cv.submitted = false
    })
  }

}

export default CommentsStateInit(AuthStore)
