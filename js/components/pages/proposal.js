/* global moment */
import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import {DEFAULT_AVATAR} from './partials/consts'
import Discussion from 'fb-like-discussions/components/discussion'
import VoteForm from './partials/voting'
import {__} from '../../state/i18n'

const _formatDate = (d) => moment(d).format('HH:mm DD.MM.YYYY')

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
        <i className='fa fa-comments' aria-hidden='true' /> {proposal.comment_count} · <i>
          {_formatDate(proposal.created)}
        </i>
        {
          proposal.tags && <span> · tags: {proposal.tags.split(',').map(i => (
            <button type='button' className='btn btn-default btn-xs'>{i}</button>
          ))}</span>
        }
      </div>
      <div className='row'>
        <div className='col-sm-12 col-md-6'>
          {
            proposal.status === 'discussing' && enabled ? (
              <button className='btn btn-sm' onClick={() => store.addProposalFeedback()}>
                {proposal.feedback === null ? __('support') : __('not support anymore')}
              </button>
            ) : (
              proposal.status === 'thinking' ? (
                <span>{__('voting begins at')}: {_formatDate(proposal.votingbegins)}</span>
              ) : (
                proposal.status === 'voting' ? (
                  <span>{__('voting ends at')}: {_formatDate(proposal.votingends)}</span>
                ) : proposal.status === 'locked' ? (
                  <span>{__('voting ended at')}: {_formatDate(proposal.votingends)}</span>
                ) : null
              )
            )
          }
          <p dangerouslySetInnerHTML={{__html: proposal.content}} />
        </div>
        <div className='col-sm-12 col-md-6'>
          {
            proposal.status === 'voting' && store.cv.votingStore.proposal ? (
              <VoteForm store={store.cv.votingStore}
                enabled={store.loggedUser !== null && proposal.status === 'voting'} />
            ) : proposal.status === 'locked' ? (
              <div>
                <h3>{__('results')}</h3>
                <p>results</p>
              </div>
            ) : null
          }
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
        formatDate={_formatDate} __={__}
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
