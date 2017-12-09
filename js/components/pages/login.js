import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import {__} from '../../state/i18n'

const LoginView = ({store, afterLogin}) => {
  //
  const onAttrChange = (attr) => (e) => {
    store.handleLoginFormChange(attr, e.target.value)
  }

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-sm-12 col-md-6'>
          <div className='form-group'>
            <label for='iUname'>username</label>
            <input type='email' className='form-control' id='iUname' placeholder={__('email')}
              onChange={onAttrChange('email')} />
          </div>
          <div className='form-group'>
            <label for='iPassword'>Password</label>
            <input type='password' className='form-control' id='iPassword' placeholder={__('password')}
              onChange={onAttrChange('passwd')} />
          </div>
          {
            store.cv.error ? (
              <div>
                {store.cv.error}&nbsp;|&nbsp;
                <a href='javascript:void' onClick={() => store.goTo('requestpwdchange')}>
                  {__('request password change')}
                </a>
              </div>
            ) : null
          }
          <div>
            <button type='submit' className='btn btn-default'
              disabled={store.cv.submitted}
              onClick={() => store.performLogin()}>{__('login')}</button>
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
