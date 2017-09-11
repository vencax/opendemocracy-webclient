import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'

const DiscussionDetail = ({discussion, detailClicked, ...rest}) => (
  <div {...rest}>
    <h4>{discussion.title}</h4>
    <p>
      {discussion.created} | {discussion.author} | {discussion.comment_count} <i className='fa fa-comments' aria-hidden='true'></i>
    </p>
    <p dangerouslySetInnerHTML={{__html: discussion.content}} />
    <button className='btn btn-sm' onClick={detailClicked}>detail</button>
  </div>
)

const DashboardPage = ({store, afterLogin}) => {
  //
  const content = store.cv.discussions.length ? (
    <ul className='comments-list'>
      {
        store.cv.discussions.map((dis, idx) => {
          function _detailClicked () {
            store.goToDetail(dis.id)
          }
          return <DiscussionDetail discussion={dis} detailClicked={_detailClicked} idx={idx} />
        })
      }
    </ul>
  ) : <span>loading</span>

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-xs-6'>
          <h3>Urgentni hlasovani</h3>
          {content}
        </div>
        <div className='col-xs-6'>
          <h3>Navrhy s dostatecnou podporou</h3>
          {content}
        </div>
      </div>
    </div>
  )
}
DashboardPage.propTypes = {
  store: PropTypes.object.isRequired,
  afterLogin: PropTypes.func.isRequired
}
export default inject('store')(observer(DashboardPage))
