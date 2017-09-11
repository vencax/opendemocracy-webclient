
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
    return this.getEntries('comments', Object.assign({
      filters: {parent: discussionID}
    }, opts))
  }

  postComment (discussion) {
    return this.saveEntry('comments', {
      parent: discussion.id,
      author: this.getLoggedUserId(),
      body: discussion.comment
    })
  }

  getReplies (commentID, opts) {
    return this.getEntries('replies', Object.assign({
      filters: {commentid: commentID}
    }, opts))
  }

  postReply (comment) {
    return this.saveEntry('replies', {
      commentid: comment.id,
      author: this.getLoggedUserId(),
      body: comment.reply
    })
  }

  getFeedback (comment) {
    return this.getEntries('commentfeedbacks', {
      filters: {
        commentid: comment.id,
        uid: this.getLoggedUserId()
      },
      page: 1,
      perPage: 1
    })
  }

  deleteCommentFeedback (comment) {
    return this.deleteEntry('commentfeedbacks', comment.feedback.id)
  }

  postCommentFeedback (comment, feedback) {
    return this.saveEntry('commentfeedbacks', {
      feedback,
      commentid: comment.id,
      uid: this.getLoggedUserId()
    })
  }
}
