/* global Conf */
import React from 'react'
import {observer} from 'mobx-react'
import {Navbar, Nav, NavItem} from 'react-bootstrap'
import UserInfo from './userinfo'
import Notifications from './notifications'
import {__} from '../state/i18n'

const AppMenu = ({store}) => {
  //
  function isActive (entityname) {
    return store.router.params.entityname === entityname
  }

  const links = (
    <Nav>
      <NavItem eventKey={1}
        active={isActive('proposals')}
        onClick={() => store.goTo('proposallist')}>
        {__('proposals')}
      </NavItem>
      {
        store.loggedUser && <NavItem eventKey={2}
          onClick={() => store.goTo('proposaledit', {id: '_new'})}>
          {__('new proposal')}
        </NavItem>
      }
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
        <Nav pullRight>
          <Notifications store={store} />
          <UserInfo store={store} />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
export default observer(AppMenu)
