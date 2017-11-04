import { observable, computed, toJS, action, transaction, extendObservable, asMap } from 'mobx'
import CommentsStateInit from 'fb-like-discussions/state'

const LSTORAGE_USER_KEY = 'opendemocracy_user'
const LSTORAGE_TOKEN_KEY = 'opendemocracy_token'

class AuthStore {

  constructor() {
    const user = localStorage.getItem(LSTORAGE_USER_KEY)
    const token = localStorage.getItem(LSTORAGE_TOKEN_KEY)
    try {
      this.loggedUser = JSON.parse(user)
      this.token = JSON.parse(token)
    } catch(e) {
      console.log(e)
    }
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
    this.goTo('login')
  }

  @action handleLoginFormChange(attr, val) {
    this.cv[attr] = val
  }

  @action performLogin() {
    this.cv.submitted = true
    this.requester.call('/login', 'POST', {
      username: this.cv.username,
      password: this.cv.password,
      email: `${this.cv.username}@test.mordor`,
      id: 123
    })
    .then((res) => {
      this.cv.submitted = false
      this.loggedUser = observable(res.data.user)
      localStorage.setItem(LSTORAGE_USER_KEY, JSON.stringify(res.data.user))
      this.token = res.data.token
      localStorage.setItem(LSTORAGE_TOKEN_KEY, JSON.stringify(res.data.token))
      this.goTo('dashboard')
    })
    .catch((err) => {
      this.error = err
      this.cv.submitted = false
    })
  }

}

export default CommentsStateInit(AuthStore)
