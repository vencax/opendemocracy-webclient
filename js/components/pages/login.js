import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'

const LoginView = ({store, afterLogin}) => {
  //
  function handleSubmit () {
    store.submitted = true
    return store.performLogin(toJS(store.credentials))
    .then((user) => {
      afterLogin()
    })
    .catch(() => {
      store.submitted = false
    })
  }

  return (
    <button onClick={() => handleSubmit()}>login</button>
  )
}
LoginView.propTypes = {
  store: PropTypes.object.isRequired
}
export default inject('store')(observer(LoginView))
