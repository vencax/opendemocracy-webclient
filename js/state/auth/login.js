import { observable, computed, toJS, action, asMap } from 'mobx'
import {__} from '../i18n'

class LoginStore {

  constructor(callService) {
    this.callService = callService
  }

  @observable data = {
    submitted: false,
    error: false,
    form: {
      email: '',
      passwd: ''
    }
  }

  @action performLogin() {
    this.data.error = null
    this.data.submitted = true
    this.callService(this.data.form)
    .then((res) => {
      this.data.submitted = false
      return res
    })
    .catch((err) => {
      this.data.error = err.response.data
      this.data.submitted = false
    })
  }

  @action handleFormChange(attr, val) {
    this.data.form[attr] = val
  }

}

export default LoginStore
