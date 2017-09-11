import React from 'react'
import {observer} from 'mobx-react'
import {Navbar, Nav, NavItem} from 'react-bootstrap'
import UserInfo from './userinfo'

const AppMenu = ({store}) => {
  //
  function isActive (entityname) {
    return store.router.params.entityname === entityname
  }

  const links = (
    <Nav>
      <NavItem eventKey={1}
        active={isActive('proposals')}
        onClick={() => store.goTo('proposals')}>
        {store.__('proposals')}
      </NavItem>
    </Nav>
  )

  return (
    <Navbar fixedTop fluid collapseOnSelect inverse={false}>
      <Navbar.Header>
        <Navbar.Brand className='cursor-pointer' onClick={() => store.goTo('dashboard')}>
          {Conf.siteName}
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        {links}
        <UserInfo store={store} />
      </Navbar.Collapse>
    </Navbar>
  )
}
export default observer(AppMenu)
