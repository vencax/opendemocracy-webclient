import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import {DEFAULT_AVATAR} from './partials/consts'
import Discussion from 'fb-like-discussions/components/discussion'
import VoteForm from './partials/voteform'
import {__} from '../../state/i18n'

const DiscussionView = ({store}) => {
  const proposal = store.cv.proposal
  const enabled = proposal && store.loggedUser !== null && proposal.status === 'discussing'

  const DefaultGravatar = observer(({user}) => {
    const uinfo = store.userinfos.get(user)
    return <img src={uinfo ? uinfo.img : DEFAULT_AVATAR} />
  })

  const DefaultHeading = observer(({record}) => {
    const uinfo = store.userinfos.get(record.uid)
    return <span>{uinfo ? uinfo.fullname : '...'} </span>
  })

  const content = proposal === null ? <span>loading</span> : (
    <div className='discussion'>
      <h1>{proposal.title}</h1>
      <div>
        <i className='fa fa-comments' aria-hidden='true'></i> {proposal.comment_count} · <i>
          {proposal.created}
        </i>
        {
          proposal.tags && <span>tags: {proposal.tags.split(',').join(', ')}</span>
        }
      </div>
      <div className='row'>
        <div className='col-sm-12 col-md-6'>
          <p dangerouslySetInnerHTML={{__html: proposal.content}} />
          {
            enabled ? (
              <button className='btn btn-sm' disabled={proposal.feedback !== null}
                onClick={() => store.addProposalFeedback()}>{__('support')}</button>
            ) : null
          }
        </div>
        <div className='col-sm-12 col-md-6'>
          <VoteForm proposal={proposal}
            enabled={store.loggedUser !== null && proposal.status === 'voting'}
            onChange={store.onVoteChange.bind(store)} />
        </div>
      </div>
      <hr />
      <Discussion discussion={proposal} state={store}
        onLoadComments={(page) => {
          store.goTo('proposal', store.router.params, {_page: page})
        }}
        showCommentForm={(show) => store.composeComment(proposal, show)}
        onCommentChange={(newVal) => store.updateComment(proposal, newVal)}
        onSendComment={() => store.sendComment(proposal)}
        onLoadReplies={(comment, page = 1) => store.loadReplies(store.cv, comment, page)}
        onReply={store.onReply.bind(store)}
        Gravatar={DefaultGravatar} Heading={DefaultHeading}
        enabled={enabled} feedbackable={store.loggedUser !== null}
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
