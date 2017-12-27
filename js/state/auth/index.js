import { observable, computed, toJS, action, transaction, extendObservable, asMap } from 'mobx'
import CommentsStateInit from 'fb-like-discussions/state'
import DataRequester from '../../services/requester'
import AuthService from '../../services/auth'
import RegisterStore from './register'
import LoginStore from './login'
import ReqTokenStore from './req_token'
import ChangePwdStore from './change_pwd'
import {__} from '../i18n'

class AuthStore {

  constructor() {
    // create requester
    const getAuthHeaders = this.getAuthHeaders.bind(this)
    this.requester = new DataRequester(Conf.apiUrl, getAuthHeaders, {})

    this.authService = new AuthService()
    const uinfo = this.authService.getInfo()
    this.loggedUser = uinfo ? uinfo.user: null
    this.token = uinfo ? uinfo.token: null
    if (this.loggedUser) {
      this.startPollingNotifications()
    }
    this.authService.grouplist(this.requester)
    .then(this.onGroupsLoaded.bind(this))
    .catch(err => {})
  }

  getAuthHeaders() {
    return this.token ? {
      'Authorization': `Bearer ${this.token}`
    } : {}
  }

  isInMyGroups(i) {
    return !i.group || this.loggedUser.groups.indexOf(i.group) >= 0
  }

  @observable userinfos = new Map()
  _ladingInfos = {}

  @observable groupinfos = new Map()

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

  @action onGroupsLoaded(groups) {
    groups.map(i => {
      this.groupinfos.set(i.id, i.name)
    })
  }

  @action showLogin() {
    this.cv = new LoginStore((form) => {
      return this.authService.login(form, this.requester)
      .then((res) => {
        this.loggedUser = observable(res.user)
        this.token = res.token
        this.startPollingNotifications()
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
    this.stopPollingNotifications()
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
