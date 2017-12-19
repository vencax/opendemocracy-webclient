import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import {__} from '../../../state/i18n'

const LoginView = ({store, afterLogin}) => {
  //
  const onAttrChange = (attr) => (e) => {
    store.cv.handleFormChange(attr, e.target.value)
  }

  return (
    <div className='container'>
      <h1>{__('user login')}</h1>
      <div className='row'>
        <div className='col-sm-12 col-md-6'>
          <div className='form-group'>
            <label for='iUname'>{__('username')}</label>
            <input type='email' className='form-control' id='iUname' placeholder={__('username')}
              onChange={onAttrChange('email')} />
          </div>
          <div className='form-group'>
            <label for='iPassword'>{__('password')}</label>
            <input type='password' className='form-control' id='iPassword' placeholder={__('password')}
              onChange={onAttrChange('passwd')} />
          </div>
          {(() => {
            switch (store.cv.data.error) {
              case 'incorrect credentials': return (
                <div>
                  {__('incorrect credentials')}&nbsp;|&nbsp;
                  <a href='javascript:void' onClick={() => store.goTo('requestpwdchange')}>
                    {__('request password change')}
                  </a>
                </div>
              )
              case 'user disabled': return (
                <div>
                  {__('user is not verified')}&nbsp;|&nbsp;
                  <a href='javascript:void' onClick={() => store.goTo('reqResendVerifyMail')}>
                    {__('resend verification email')}
                  </a>
                </div>
              )
              default:
                return null
            }
          })()}
          <div>
            <button type='submit' className='btn btn-default'
              disabled={store.cv.data.submitted}
              onClick={() => store.cv.performLogin()}>{__('login')}</button>
            &nbsp;|&nbsp;
            <a href='javascript:void' onClick={() => store.goTo('register')}>{__('register')}</a>
          </div>
        </div>
      </div>
    </div>
  )
}
LoginView.propTypes = {
  store: PropTypes.object.isRequired
}
export default inject('store')(observer(LoginView))
