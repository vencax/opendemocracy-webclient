import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Discussion from 'fb-like-discussions/components/discussion'

const DefaultGravatar = ({user}) => (
  <img src='http://www.imran.com/xyper_images/icon-user-default.png' />
)

const DefaultHeading = ({record}) => (
  <span>{record.uid} <span>{record.created}</span></span>
)

const DiscussionView = ({store}) => {
  const proposal = store.cv.proposal

  const content = proposal === null ? <span>loading</span> : (
    <div className='discussion'>
      <h1>{proposal.title}</h1>
      <p dangerouslySetInnerHTML={{__html: proposal.content}} />
      <p>comments: {proposal.comment_count}</p>
      {
        proposal.status === 'discussing' ? (
          <button className='btn btn-sm' disabled={proposal.feedback !== null}
            onClick={() => store.addProposalFeedback()}>support</button>
        ) : null
      }
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
        enabled={proposal.status === 'discussing'}
      />
    </div>
  )
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
DiscussionView.propTypes = {
  store: PropTypes.object.isRequired
}
export default inject('store')(observer(DiscussionView))
