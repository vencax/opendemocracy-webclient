import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import {__} from '../../../state/i18n'

const RegisterView = ({store, afterLogin}) => {
  //
  const onAttrChange = (attr) => (e) => {
    store.cv.handleFormChange(attr, e.target.value)
  }
  const errs = store.cv.data.errors

  return (
    <div className='container'>
      <h1>{__('new user registration')}</h1>
      <div className='row'>
        <div className='col-sm-12 col-md-6'>
          <div className='form-group'>
            <label for='iName'>{__('name')}</label>
            <input type='text' className='form-control' id='iName' placeholder={__('name')}
              onChange={onAttrChange('name')} />
            {
              errs.has('name') ? <span className='error'>{errs.get('name')}</span> : null
            }
          </div>
          <div className='form-group'>
            <label for='iUname'>{__('username')}</label>
            <input type='text' className='form-control' id='iUname' placeholder={__('username')}
              onChange={onAttrChange('username')} />
            {
              errs.has('username') ? <span className='error'>{errs.get('username')}</span> : null
            }
          </div>
          <div className='form-group'>
            <label for='iEmail'>{__('email')}</label>
            <input type='email' className='form-control' id='iEmail' placeholder={__('email')}
              onChange={onAttrChange('email')} />
            {
              errs.has('email') ? <span className='error'>{errs.get('email')}</span> : null
            }
          </div>
          <div className='form-group'>
            <label for='iPassword'>{__('password')}</label>
            <input type='password' className='form-control' id='iPassword' placeholder={__('password')}
              onChange={onAttrChange('password')} />
            {
              errs.has('password') ? <span className='error'>{errs.get('password')}</span> : null
            }
          </div>
          {
            store.cv.data.error === 'success' ? (
              <div>
                <i className='fa fa-check' />&nbsp;
                {__('user created, check your mailbox for further instruction')}
              </div>
            ) : (
              <div>{store.cv.data.error}</div>
            )
          }
          {
            store.cv.data.error !== 'success' && (
              <div>
                <button type='submit' className='btn btn-default'
                  disabled={store.cv.data.submitted || errs.size > 0}
                  onClick={() => store.cv.performRegister()}>{__('submit')}</button>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
RegisterView.propTypes = {
  store: PropTypes.object.isRequired
}
export default inject('store')(observer(RegisterView))
