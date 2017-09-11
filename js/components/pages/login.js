import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'

const LoginView = ({store, afterLogin}) => {
  //
  function handleSubmit (evt) {
    evt.stopPropagation()
    return store.performLogin()
  }

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-sm-12 col-md-6'>
          <form>
            <div className='form-group'>
              <label for='iUname'>username</label>
              <input type='email' className='form-control' id='iUname' placeholder='username' />
            </div>
            <div className='form-group'>
              <label for='iPassword'>Password</label>
              <input type='password' className='form-control' id='iPassword' placeholder='password' />
            </div>
            <button type='submit' className='btn btn-default'
              disabled={store.cv.submitted}
              onClick={handleSubmit}>login</button>
          </form>
        </div>
      </div>
    </div>
  )
}
LoginView.propTypes = {
  store: PropTypes.object.isRequired
}
export default inject('store')(observer(LoginView))
