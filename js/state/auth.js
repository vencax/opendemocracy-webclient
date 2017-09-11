import { observable, computed, toJS, action, transaction, extendObservable, asMap } from 'mobx'

export default (BaseStore) => class AuthStore extends BaseStore {

  getAuthHeaders() {
    return this.token ? {
      'Authorization': `Bearer ${this.token}`
    } : {}
  }

  @action showLogin() {
    this.cv = observable({
      submitted: false,
      error: false,
      uname: '',
      passw: ''
    })
  }

  @action logout() {
    this.loggedUser = null
    this.token = null
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
      this.token = res.data.token
    })
    .catch((err) => {
      this.error = err
      this.cv.submitted = false
    })
  }

}
