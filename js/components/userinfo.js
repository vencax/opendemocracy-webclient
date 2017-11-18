import React from 'react'
import {observer} from 'mobx-react'
import {Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap'
import {__} from '../state/i18n'

const UserInfo = ({store}) => {
  //
  const u = store.loggedUser
  const uinfo = u === null ? (
    <NavItem eventKey={3} onClick={() => store.goTo('login')}>
      {__('login')}
    </NavItem>
  ) : (
    <NavDropdown eventKey={4} title={__('user')} id='user-nav-dropdown'>
      {u.username && (
        <MenuItem header>
          <strong>{u.username}</strong>
        </MenuItem>
      )}
      {u.email && <MenuItem header>{u.email}</MenuItem>}
      {u.picture && <MenuItem header><img src={u.picture} /></MenuItem>}
      <MenuItem divider />
      <MenuItem eventKey={4.1} onClick={() => store.logout()}>
        {__('logout')}
      </MenuItem>
    </NavDropdown>
  )
  return (
    <Nav pullRight>{uinfo}</Nav>
  )
}

export default observer(UserInfo)
