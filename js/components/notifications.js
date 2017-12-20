import React from 'react'
import {observer} from 'mobx-react'
import {Badge, MenuItem, NavDropdown} from 'react-bootstrap'
import {__} from '../state/i18n'

const Notifications = ({store}) => {
  const title = () => <span><i className='fa fa-bell' /> <Badge>{store.notifications.length}</Badge></span>
  return store.notifications.length > 0 ? (
    <NavDropdown eventKey={444} title={title()} id='notifs-nav-dropdown'>
      {
        store.notifications.map(i => {
          switch (i.evt) {
            case 'propsuport': return (
              <MenuItem onClick={() => store.goTo('proposal', {id: i.objid})}>
                {i.title} {__('got enough support')}
              </MenuItem>
            )
          }
        })
      }
    </NavDropdown>
  ) : null
}
export default observer(Notifications)
