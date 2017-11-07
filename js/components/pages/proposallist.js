import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import DiscussionAbbrev from './partials/discussion_abbrev'

const DiscussionsView = ({ store }) => {
  const content = store.cv.proposals ? (
    store.cv.proposals.length ? (
      <ul className='comments-list'>
        {
          store.cv.proposals.map((dis, idx) => {
            function _detailClicked () {
              store.goToDetail(dis.id)
            }
            const editButton = (store.loggedUser && dis.uid === store.loggedUser.id) ? (
              <button className='btn btn-sm' onClick={() => store.goTo('proposaledit', {id: dis.id})}>edit</button>
            ) : null
            return <DiscussionAbbrev discussion={dis} detailClicked={_detailClicked}
              idx={idx} editButton={editButton} userinfos={store.userinfos} />
          })
        }
      </ul>
    ) : <span>empty</span>
  ) : <span>loading</span>

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-xs-12'>
          {content}
        </div>
      </div>
    </div>
  )
}
DiscussionsView.propTypes = {
  store: PropTypes.object.isRequired
}
export default inject('store')(observer(DiscussionsView))
