import { observable, computed, toJS, action, transaction, extendObservable, asMap } from 'mobx'
import CommentsStateInit from 'fb-like-discussions/state'
import AuthService from '../../services/auth'
import RegisterStore from './register'
import LoginStore from './login'
import ReqTokenStore from './req_token'
import ChangePwdStore from './change_pwd'
import {__} from '../i18n'

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
    this.cv = new LoginStore((form) => {
      return this.authService.login(form, this.requester)
      .then((res) => {
        this.loggedUser = observable(res.user)
        this.token = res.token
        this.goTo('dashboard')
      })
    })
  }

  @action showRegister() {
    this.cv = new RegisterStore((form) => {
      return this.authService.register(form, this.requester)
    })
  }

  @action logout() {
    this.loggedUser = null
    this.token = null
    this.authService.logout()
    this.goTo('login')
  }

  showReqToken(changingPwd) {
    const callService = changingPwd
      ? (email) => this.authService.requestPwdChange(email, this.requester)
      : (email) => this.authService.requestResendVerifMail(email, this.requester)
    this.cv = new ReqTokenStore(callService, changingPwd)
  }

  showPwdChange(token) {
    this.cv = new ChangePwdStore((password) => {
      return this.authService.setPwd(password, token, this.requester)
    })
  }

}

export default CommentsStateInit(AuthStore)
