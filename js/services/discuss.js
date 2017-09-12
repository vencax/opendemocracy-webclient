
export default (BaseClass) => class DiscussRequester extends BaseClass {
  //
  getDiscussions (opts) {
    const qpars = {
      page: opts.page || 1,
      perPage: opts.perPage || 10
    }
    return this.getEntries(opts.entityname, qpars)
  }

  getDiscussion (id) {
    return this.getEntry('proposals', id)
  }

  getComments (discussionID, opts) {
    const url = `comments/${discussionID}`
    return this.getEntries(url, opts)
  }

  postComment (discussion) {
    return this.saveEntry('comments', {
      parent: discussion.id,
      content: discussion.comment
    })
  }

  getReplies (commentID, opts) {
    return this.getEntries('replies', Object.assign({
      filters: {commentid: commentID}
    }, opts))
  }

  postReply (comment) {
    const url = `/comments/${comment.id}/replies`
    return this.call(url, 'post', {
      content: comment.reply
    })
  }

  getFeedback (comment, uid) {
    const url = `/comments/${comment.id}/feedbacks`
    return this.call(url)
  }

  deleteCommentFeedback (comment) {
    return this.call(`/comments/${comment.id}/feedbacks`, 'delete')
  }

  postCommentFeedback (comment, feedback) {
    return this.saveEntry(`comments/${comment.id}/feedbacks`, {
      value: feedback
    })
  }
}
