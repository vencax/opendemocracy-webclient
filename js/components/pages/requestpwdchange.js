import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import {__} from '../../state/i18n'

const ReqPwdChangeView = ({store, afterLogin}) => {
  //
  const onAttrChange = (attr) => (e) => {
    store.handleLoginFormChange(attr, e.target.value)
  }

  return (
    <div className='container'>
      <h1>{__('request forgotten password')}</h1>
      <div className='row'>
        <div className='col-sm-12 col-md-6'>
          <div className='form-group'>
            <label for='iEmail'>{__('email')}</label>
            <input type='email' className='form-control' id='iEmail' placeholder={__('email')}
              onChange={onAttrChange('email')} />
          </div>
          {
            store.cv.error ? <div>{store.cv.error}</div> : null
          }
          <div>
            <button type='submit' className='btn btn-default'
              disabled={store.cv.submitted}
              onClick={() => store.performReqPwdChange()}>{__('submit')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
ReqPwdChangeView.propTypes = {
  store: PropTypes.object.isRequired
}
export default inject('store')(observer(ReqPwdChangeView))
