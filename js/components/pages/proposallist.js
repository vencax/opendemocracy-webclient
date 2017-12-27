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
            return <DiscussionAbbrev discussion={dis} idx={idx}
              detailClicked={_detailClicked}
              userinfos={store.userinfos} groupinfos={store.groupinfos} />
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
