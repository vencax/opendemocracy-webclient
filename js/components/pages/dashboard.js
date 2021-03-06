import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import DiscussionAbbrev from './partials/discussion_abbrev'
import {__} from '../../state/i18n'

const DashboardPage = ({store}) => {
  //
  function renderProposalList (list, renderEdit = false) {
    return list ? (
      list.length ? (
        <div className='proposal-list'>
          {
            list.map((dis, idx) => {
              function _detailClicked () {
                store.goToDetail(dis.id)
              }
              const editButton = (renderEdit && store.loggedUser && dis.uid === store.loggedUser.id) ? (
                <button className='btn btn-sm' onClick={() => store.goTo('proposaledit', {id: dis.id})}>{__('edit')}</button>
              ) : null
              return <DiscussionAbbrev discussion={dis} detailClicked={_detailClicked}
                idx={idx} editButton={editButton}
                userinfos={store.userinfos} groupinfos={store.groupinfos} />
            })
          }
        </div>
      ) : <span>{__('empty')}</span>
    ) : <span>{__('loading')}</span>
  }

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-6 col-xs-12'>
          <h3>{__('open votings')}</h3>
          {renderProposalList(store.cv.ready4voting)}
        </div>
        <div className='col-md-6 col-xs-12'>
          <h3>{__('proposals with support')}</h3>
          {renderProposalList(store.cv.justsupported)}
          {
            store.loggedUser !== null ? (
              <div>
                <h3>{__('my concepts')}</h3>
                {renderProposalList(store.cv.myproposals, true)}
              </div>
            ) : null
          }
        </div>
      </div>
    </div>
  )
}
DashboardPage.propTypes = {
  store: PropTypes.object.isRequired
}
export default inject('store')(observer(DashboardPage))
