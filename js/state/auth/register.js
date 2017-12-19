import { observable, computed, toJS, action, asMap } from 'mobx'
import {__} from '../i18n'

class RegisterStore {

  constructor(callRegisterService) {
    this.callRegisterService = callRegisterService
    for (let v in this.validators) {
      this._validate(v, this.data.form[v])
    }
  }

  @observable data = {
    submitted: false,
    error: false,
    errors: observable.map({}),
    form: {
      username: '',
      password: '',
      name: '',
      email: ''
    }
  }

  validators = {
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

  @action handleFormChange(attr, val) {
    this.data.form[attr] = val
    this._validate(attr, val)
  }

  _validate(attr, val) {
    const err = this.validators[attr](val)
    return err ? this.data.errors.set(attr, err) : this.data.errors.delete(attr)
  }

  @action performRegister() {
    this.data.error = null
    this.data.submitted = true
    this.callRegisterService(this.data.form)
    .then((res) => {
      this.data.error = 'success'
    })
    .catch((err) => {
      this.data.error = __('user already exists')
      this.data.submitted = false
    })
  }

}

export default RegisterStore
