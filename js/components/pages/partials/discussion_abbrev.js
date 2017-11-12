/* global marked */
import React from 'react'
import { observer } from 'mobx-react'

const DiscussionAbbrev = ({discussion, detailClicked, editButton, userinfos, ...rest}) => {
  const user = userinfos.get(discussion.uid)

  return (
    <div {...rest}>
      <div className='media'>
        <div className='media-left'>
          <a href='javascript:void(0)' onClick={detailClicked}>
            <img src={user ? user.img : ''} className='gravatar' />
          </a>
        </div>
        <div className='media-body'>
          <h4 className='media-heading'>
            <a href='javascript:void(0)' onClick={detailClicked}>{discussion.title}</a> { editButton }
          </h4>
          <p>
            {user ? user.fullname : '...'} · {discussion.created} · {discussion.comment_count} <i className='fa fa-comments' aria-hidden='true'></i>
          </p>
          <p dangerouslySetInnerHTML={{__html: marked(discussion.content)}} />
        </div>
      </div>
    </div>
  )
}
export default observer(DiscussionAbbrev)
