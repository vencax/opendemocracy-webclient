import { observable, computed, toJS, action, transaction, asMap } from 'mobx'
import {__} from '../i18n'

class ChangePwdStore {

  constructor(callService) {
    this.callService = callService
    this.data = observable({
      submitted: false,
      error: false,
      errors: observable.map({}),
      form: {
        password: ''
      }
    })
    this.validators = {
      password: (val) => {
        if (val.length < 8) {
          return __('too short')
        }
      }
    }
    this._validate('password', this.data.form.password)
  }

  _validate(attr, val) {
    const err = this.validators[attr](val)
    return err ? this.data.errors.set(attr, err) : this.data.errors.delete(attr)
  }

  @action handleFormChange(attr, val) {
    this.data.form[attr] = val
    this._validate(attr, val)
  }

  @action performPwdChange() {
    this.data.error = null
    this.data.submitted = true
    this.callService(this.data.form.password)
    .then((res) => {
      this.data.error = 'success'
    })
    .catch((err) => {
      this.data.error = err.toString()
      this.data.submitted = false
    })
  }

}

export default ChangePwdStore
