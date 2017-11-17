import { observable, computed, toJS, action, extendObservable } from 'mobx'
import AuthStore from './auth'

class ProposalStore extends AuthStore {

  @action showProposalList(params) {
    this.cv = observable({
      proposals: null
    })
    this.requester.call(`/proposals`)
    .then((res) => {
      res.data.map((i) => this.loadUserInfo(i.uid)) // load userinfos
      this.cv.proposals = res.data
    })
    .catch(this.onError.bind(this))
  }

  @action showProposal(id, page = 1) {
    this.cv = observable({
      proposal: null,
      discussionid: id
    })

    let promise = this.requester.call(`/proposals/${id}`)
    if (this.loggedUser !== null) {
      promise = Promise.all([
        promise,
        this.requester.call(`/proposals/${id}/feedbacks`)
      ])
    }
    promise.then((res) => {
      const p = res.length === 2 ? res[0].data : res.data
      p.feedback = res.length === 2 ? res[1].data : null
      return p
    })
    .then(action('onProposalLoaded', (proposal) => {
      proposal.comments = []
      proposal.comment = null
      this.cv.proposal = proposal
      return this.loadComments(this.cv, this.cv.proposal, {page, perPage: 2})
    }))
    .then((comments) => {
      this.cv.proposal.comments.map(i => this.loadUserInfo(i.uid))  // load userinfos
    })
    .catch(this.onError.bind(this))
  }

  loadReplies(store, comment, page) {
    super.loadReplies(store, comment, page)
    .then((comments) => {
      comment.replies.map(i => this.loadUserInfo(i.uid))  // load userinfos
    })
  }

  @action editProposal(id) {
    const adding = id === '_new'
    this.cv = observable({
      loading: adding ? false : true,
      record: adding ? {
        title: '',
        content: '',
      } : null,
      options: [],
      optionerrors: observable.map({}),
      errors: observable.map({}),
      editedOption: null
    })
    if (!adding) {
      this.requester.getEntry('proposals', id, {_load: 'options'})
      .then(this.onProposalLoaded.bind(this))
      .catch(this.onError.bind(this))
    }
  }

  @action onOptionAttrChange(attr, val) {
    this.cv.editedOption[attr] = val
  }

  @action editOption(opt) {
    this.cv.editedOption = opt ? Object.assign({}, opt) : {
      title: '',
      content: ''
    }
  }

  @action removeOption(opt) {
    this.requester.call(`/proposals/${this.cv.record.id}/options/${opt.id}`, 'delete')
    .then((data) => {
      const idx = this.cv.options.indexOf(opt)
      this.cv.options.splice(idx, 1)
    })
    .catch(this.onError.bind(this))
  }

  @action saveOption() {
    const id = this.cv.editedOption.id
    const url = id
      ? `/proposals/${this.cv.record.id}/options/${this.cv.editedOption.id}`
      : `/proposals/${this.cv.record.id}/options`
    const method = id ? 'put' : 'post'
    this.requester.call(url, method, this.cv.editedOption)
    .then((res) => {
      if (id) {
        const existing = this.cv.options.find((i) => i.id === id)
        Object.assign(existing, res.data[0])
      } else {
        this.cv.options.push(res.data)
      }
      this.cv.editedOption = null
    })
    .catch(this.onError.bind(this))
  }

  @action cancelEditOption() {
    this.cv.editedOption = null
  }

  @action onProposalLoaded(proposal) {
    this.cv.loading = false
    this.cv.options = proposal.options
    delete proposal.options
    this.cv.record = proposal
  }

  @action handleProposalFormChange(attr, val) {
    this.cv.record[attr] = val
  }

  @action saveProposal() {
    this.cv.loading = true
    this.requester.saveEntry('proposals', this.cv.record, this.cv.record.id)
    .then(action('onProposalSaved', (data) => {
      if (!this.cv.record.id) { // move to edit view if created new one
        this.router.params.id = data.id
      }
      extendObservable(this.cv.record, data)
      this.addMessage('saved')
      this.cv.loading = false
    }))
    .catch(this.onError.bind(this))
  }

  @action publishProposal() {
    this.requester.call(`/proposals/${this.cv.record.id}/publish`, 'put')
    .then((res) => {
      this.goTo('dashboard')
    })
    .catch(this.onError.bind(this))
  }

  @action addProposalFeedback() {
    this.cv.proposal.feedback = 'loading'
    this.requester.call(`/proposals/${this.cv.proposal.id}/feedbacks`, 'post', {value: 1})
    .then((res) => {
      this.cv.proposal.feedback = res.data
      if (res.data.nextstatus && this.cv.proposal.status !== res.data.nextstatus) {
        this.cv.proposal.status = res.data.nextstatus
      }
    })
    .catch(this.onError.bind(this))
  }

  @action onReply(comment, reply) {
    comment.reply = reply === null ? '' : '@' + this.userinfos.get(reply.uid).fullname
  }

}

export default ProposalStore
