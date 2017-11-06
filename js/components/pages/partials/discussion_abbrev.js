import React from 'react'
import { observer } from 'mobx-react'

const DiscussionAbbrev = ({discussion, detailClicked, editButton, userinfos, ...rest}) => {
  const user = userinfos.get(discussion.uid)

  return (
    <div {...rest}>
      <div className='media'>
        <div className='media-left'>
          <img src={user ? user.img : ''} className='gravatar' />
        </div>
        <div className='media-body'>
          <h6 className='media-heading'>
            <h4>{discussion.title}</h4>
          </h6>
          <p>
            {user ? user.fullname : '...'} | {discussion.created} | {discussion.comment_count} <i className='fa fa-comments' aria-hidden='true'></i>
          </p>
          <p dangerouslySetInnerHTML={{__html: discussion.content}} />
          <button className='btn btn-sm' onClick={detailClicked}>detail</button>
          { editButton }
        </div>
      </div>
    </div>
  )
}
export default observer(DiscussionAbbrev)
