/* global marked, moment */
import React from 'react'
import { observer } from 'mobx-react'
import {DEFAULT_AVATAR} from './consts'

const DiscussionAbbrev = ({discussion, detailClicked, editButton, userinfos, ...rest}) => {
  const user = userinfos.get(discussion.uid)

  return (
    <div {...rest}>
      <div className='media'>
        <div className='media-left'>
          <a href='javascript:void(0)' onClick={detailClicked}>
            <img src={user && user.img ? user.img : DEFAULT_AVATAR} className='gravatar' />
          </a>
        </div>
        <div className='media-body'>
          <h4 className='media-heading'>
            <a href='javascript:void(0)' onClick={detailClicked}>{discussion.title}</a> { editButton } {discussion.status}
          </h4>
          <p>
            {user ? user.name : '...'} · {moment(discussion.created).format('DD.MM.YYYY')} · {discussion.comment_count} <i className='fa fa-comments' />
          </p>
          <p dangerouslySetInnerHTML={{__html: marked(discussion.content)}} />
        </div>
      </div>
    </div>
  )
}
export default observer(DiscussionAbbrev)
