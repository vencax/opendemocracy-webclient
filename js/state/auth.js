import { observable, computed, toJS, action, transaction, extendObservable, asMap } from 'mobx'
import CommentsStateInit from 'fb-similar-discussions/state'

const LSTORAGE_USER_KEY = 'opendemocracy_user'
const LSTORAGE_TOKEN_KEY = 'opendemocracy_user'

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
      localStorage.setItem(LSTORAGE_USER_KEY, JSON.stringify(res.data.user))
      this.token = res.data.token
      localStorage.setItem(LSTORAGE_TOKEN_KEY, JSON.stringify(res.data.token))
    })
    .catch((err) => {
      this.error = err
      this.cv.submitted = false
    })
  }

}

export default CommentsStateInit(AuthStore)
