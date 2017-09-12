import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Discussion from 'fb-like-discussions/components/discussion'

const DiscussionView = ({store}) => {
  const dis = store.cv.discussion

  return dis === null ? <span>loading</span> : (
    <div className='discussion'>
      <h1>{dis.title}</h1>
      <p dangerouslySetInnerHTML={{__html: dis.content}} />
      <hr />
      <Discussion discussion={dis} store={store}
        onLoadComments={(page = 1) => store.loadComments(store.cv, dis, page)}
        showCommentForm={(show) => store.composeComment(dis, show)}
        onCommentChange={(newVal) => store.updateComment(dis, newVal)}
        onSendComment={() => store.sendComment(dis)}
        onLoadReplies={(comment, page = 1) => store.loadReplies(store.cv, comment, page)}
      />
    </div>
  )
}
DiscussionView.propTypes = {
  store: PropTypes.object.isRequired
}
export default inject('store')(observer(DiscussionView))
