import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import {__} from '../../../state/i18n'

const PwdChangeView = ({store, afterLogin}) => {
  //
  const onAttrChange = (attr) => (e) => {
    store.cv.handleFormChange(attr, e.target.value)
  }
  const errs = store.cv.data.errors

  return (
    <div className='container'>
      <h1>{__('set new password')}</h1>
      <div className='row'>
        <div className='col-sm-12 col-md-6'>
          <div className='form-group'>
            <label for='iPwd'>{__('password')}</label>
            <input type='password' className='form-control' id='iPwd' placeholder={__('password')}
              onChange={onAttrChange('password')} />
            {
              errs.has('password') ? <span className='error'>{errs.get('password')}</span> : null
            }
          </div>
          {
            store.cv.data.error ? <div><i className='fa fa-check' />&nbsp;{store.cv.data.error}</div> : null
          }
          {
            store.cv.data.error === 'success' && (
              <span>
                {__('password changed')}.
                <a href='javascript:void' onClick={() => store.goTo('login')}>
                  {__('now login with the new one')}
                </a>
              </span>
            )
          }
          <div>
            <button type='submit' className='btn btn-default'
              disabled={store.cv.data.submitted || errs.size > 0}
              onClick={() => store.cv.performPwdChange()}>{__('submit')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
PwdChangeView.propTypes = {
  store: PropTypes.object.isRequired
}
export default inject('store')(observer(PwdChangeView))
