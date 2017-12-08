import { observable, computed, toJS, action, transaction, extendObservable, asMap } from 'mobx'
import CommentsStateInit from 'fb-like-discussions/state'
import AuthService from '../services/auth'
import {__} from './i18n'

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

  @observable userinfos = new Map()
  _ladingInfos = {}

  @action loadUserInfo(uid) {
    if (!(uid in this._ladingInfos)) {
      this._ladingInfos[uid] = this.authService.getUserInfos([uid], this.requester)
      .then((infos) => {
        delete this._ladingInfos[uid]
        this.userinfos.set(uid, infos[0])
      })
    }
    return this._ladingInfos[uid]
  }

  @action showLogin() {
    this.cv = observable({
      submitted: false,
      error: false,
      form: {
        email: '',
        passwd: ''
      }
    })
  }

  @action showRegister() {
    this.cv = observable({
      submitted: false,
      error: false,
      errors: observable.map({}),
      form: {
        username: '',
        password: '',
        name: '',
        email: ''
      }
    })
    this.cv.validators = {
      name: (val) => {
        if (val.length === 0) {
          return __('mandatory')
        }
        if (val.length > 64) {
          return __('too long')
        }
      },
      username: (val) => {
        if (val.length === 0) {
          return __('mandatory')
        }
        if (val.length > 64) {
          return __('too long')
        }
      },
      password: (val) => {
        if (val.length === 0) {
          return __('mandatory')
        }
        if (val.length > 64) {
          return __('too long')
        }
      },
      email: (val) => {
        if (val.length === 0) {
          return __('mandatory')
        }
        if (!val.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
          return __('invalid email')
        }
        if (val.length > 64) {
          return __('too long')
        }
      }
    }
    for (let v in this.cv.validators) {
      this._validate(v, this.cv.form[v])
    }
  }

  @action handleRegisterFormChange(attr, val) {
    this.cv.form[attr] = val
    this._validate(attr, val)
  }

  _validate(attr, val) {
    const err = this.cv.validators[attr](val)
    return err ? this.cv.errors.set(attr, err) : this.cv.errors.delete(attr)
  }

  @action performRegister() {
    this.cv.submitted = true
    this.authService.register(this.cv.form, this.requester)
    .then((res) => {
      this.cv.error = 'success'
    })
    .catch((err) => {
      this.error = err
      this.cv.submitted = false
    })
  }

  @action logout() {
    this.loggedUser = null
    this.token = null
    this.authService.logout()
    this.goTo('login')
  }

  @action handleLoginFormChange(attr, val) {
    this.cv.form[attr] = val
  }

  @action performLogin() {
    this.cv.submitted = true
    this.authService.login(this.cv.form, this.requester)
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
