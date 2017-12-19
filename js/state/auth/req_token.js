import { observable, computed, toJS, action, transaction, asMap } from 'mobx'
import {__} from '../i18n'

class ReqestTokenStore {

  constructor(callService, changingPwd) {
    this.callService = callService
    this.data = observable({
      changingPwd,
      submitted: false,
      error: null,
      form: {
        email: ''
      }
    })
  }

  @action handleFormChange(attr, val) {
    this.data.form[attr] = val
  }

  @action performReqToken() {
    this.data.error = null
    this.data.submitted = true
    this.callService(this.data.form.email)
    .then((res) => {
      this.data.error = 'success'
    })
    .catch((err) => {
      this.data.error = __('unrecognized email')
      this.data.submitted = false
    })
  }

}

export default ReqestTokenStore
