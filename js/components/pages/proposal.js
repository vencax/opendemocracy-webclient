/* global moment marked */
import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import {DEFAULT_AVATAR} from './partials/consts'
import Discussion from 'fb-like-discussions/components/discussion'
import VoteForm from './partials/voting'
import Results from './partials/results'
import {__} from '../../state/i18n'

const _formatDate = (d) => moment(d).format('HH:mm DD.MM.YYYY')

const ToolBar = ({proposal, enabled, onFeedbackClick}) => {
  switch (proposal.status) {
    case 'discussing':
      return enabled ? (
        <button className='btn btn-sm' onClick={onFeedbackClick}>
          {proposal.feedback === null ? __('support') : __('not support anymore')}
        </button>
      ) : null
    case 'thinking':
      return <span>{__('voting begins at')}: {_formatDate(proposal.votingbegins)}</span>
    case 'voting':
      return <span>{__('voting ends at')}: {_formatDate(proposal.votingends)}</span>
    case 'locked':
      return <span>{__('voting ended at')}: {_formatDate(proposal.votingends)}</span>
    default:
      return null
  }
}

const DiscussionView = ({store}) => {
  const proposal = store.cv.proposal
  const enabled = proposal && store.loggedUser !== null && store.isInMyGroups(proposal)

  const DefaultGravatar = observer(({user}) => {
    const uinfo = store.userinfos.get(user)
    return <img src={uinfo && uinfo.img ? uinfo.img : DEFAULT_AVATAR} />
  })

  const DefaultHeading = observer(({record}) => {
    const uinfo = store.userinfos.get(record.uid)
    return <span>{uinfo ? uinfo.name : '...'} </span>
  })

  const content = proposal === null ? <span>loading</span> : (
    <div className='discussion'>
      <h1>{proposal.title}</h1>
      <div>
        {proposal.status} · <i className='fa fa-comments' /> {proposal.comment_count} · <i>
          {_formatDate(proposal.created)}
        </i>
        {
          proposal.tags && <span> · tags: {proposal.tags.split(',').map(i => (
            <button type='button' className='btn btn-default btn-xs'>{i}</button>
          ))}</span>
        }
        {
          proposal.group && <span> · {__('group')}: {store.groupinfos.get(proposal.group)}</span>
        }
      </div>
      <div className='row'>
        <div className='col-sm-12 col-md-6'>
          <ToolBar proposal={proposal} enabled={enabled}
            onFeedbackClick={() => store.addProposalFeedback()} />
          <p dangerouslySetInnerHTML={{__html: marked(proposal.content)}} />
        </div>
        <div className='col-sm-12 col-md-6'>
          {
            proposal.status === 'locked' ? (
              <div>
                <h3>{__('results')}</h3>
                <Results proposal={proposal} />
              </div>
            ) : (
              <VoteForm store={store.cv.votingStore}
                enabled={enabled && proposal.status === 'voting'} />
            )
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
        enabled={enabled && proposal.status === 'discussing'}
        feedbackable={store.loggedUser !== null}
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
