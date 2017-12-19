import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import {__} from '../../../state/i18n'

const ReqPwdChangeView = ({store}) => {
  //
  const onAttrChange = (attr) => (e) => {
    store.cv.handleFormChange(attr, e.target.value)
  }
  function _successMessage () {
    const p = store.cv.data.changingPwd
      ? __('password change requested')
      : __('verification mail resent')
    return `${p}, ${__('see your mailbox for details')}`
  }

  return (
    <div className='container'>
      <h1>{
        store.cv.data.changingPwd
          ? __('request password change')
          : __('resend verification email')
        }</h1>
      <div className='row'>
        <div className='col-sm-12 col-md-6'>
          <div className='form-group'>
            <label for='iEmail'>{__('email')}</label>
            <input type='email' className='form-control' id='iEmail' placeholder={__('email')}
              onChange={onAttrChange('email')} />
          </div>
          {
            (() => {
              switch (store.cv.data.error) {
                case 'success': return (
                  <div><i className='fa fa-check' />&nbsp;{_successMessage()}</div>
                )
                case null:
                  return null
                case 'user not found': return (
                  <div><i className='fa fa-check' />&nbsp;{__('unrecognized email')}</div>
                )
                default: return (
                  <div><i className='fa fa-check' />&nbsp;{store.cv.data.error}</div>
                )
              }
            })()
          }
          {
            store.cv.data.error !== 'success' && (
              <div>
                <button type='submit' className='btn btn-default'
                  disabled={store.cv.data.submitted}
                  onClick={() => store.cv.performReqToken()}>{__('submit')}
                </button>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
ReqPwdChangeView.propTypes = {
  store: PropTypes.object.isRequired
}
export default inject('store')(observer(ReqPwdChangeView))
