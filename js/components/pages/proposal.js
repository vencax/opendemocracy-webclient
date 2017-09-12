import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Discussion from 'fb-like-discussions/components/discussion'

const DefaultGravatar = ({user}) => (
  <img src='http://www.imran.com/xyper_images/icon-user-default.png' />
)

const DefaultHeading = ({record}) => (
  <span>{record.author} <span>{record.created}</span></span>
)

const DiscussionView = ({store}) => {
  const proposal = store.cv.proposal

  return proposal === null ? <span>loading</span> : (
    <div className='discussion'>
      <h1>{proposal.title}</h1>
      <p dangerouslySetInnerHTML={{__html: proposal.content}} />
      <hr />
      <Discussion discussion={proposal} state={store}
        onLoadComments={(page) => {
          store.goTo('proposal', store.router.params, {_page: page})
        }}
        showCommentForm={(show) => store.composeComment(proposal, show)}
        onCommentChange={(newVal) => store.updateComment(proposal, newVal)}
        onSendComment={() => store.sendComment(proposal)}
        onLoadReplies={(comment, page = 1) => store.loadReplies(store.cv, comment, page)}
        Gravatar={DefaultGravatar} Heading={DefaultHeading}
      />
    </div>
  )
}
DiscussionView.propTypes = {
  store: PropTypes.object.isRequired
}
export default inject('store')(observer(DiscussionView))
