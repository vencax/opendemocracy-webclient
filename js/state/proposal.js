import { observable, computed, toJS, action, extendObservable } from 'mobx'
import AuthStore from './auth'
import VotingStore from './voting'
import {__} from './i18n'

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
      discussionid: id,
      votingStore: new VotingStore(this.requester, this.onError.bind(this))
    })

    this.requester.call(`/proposals/${id}?_load=options`)
    .then((res) => {
      const p = res.data
      p.feedback = null
      p.results = null
      if (this.loggedUser !== null) {
        this.requester.call(`/proposals/${id}/feedbacks`)
        .then((res) => {
          this.cv.proposal.feedback = res.data
        })
        .catch(() => {})
      }
      if (p.status === 'locked') {
        this.requester.call(`/proposals/${p.id}/results`)
        .then((res) => {
          this.cv.proposal.results = res.data
        })
        .catch(this.onError.bind(this))
      }
      return p
    })
    .then(action('onProposalLoaded', (proposal) => {
      proposal.comments = []
      proposal.comment = null
      this.cv.proposal = proposal
      this.cv.votingStore.load(this.cv.proposal)
      return this.loadComments(this.cv, this.cv.proposal, {
        page, perPage: 2, loadFeedbacks: this.loggedUser !== null
      })
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
        tags: ''
      } : null,
      options: [],
      optionerrors: observable.map({}),
      errors: observable.map({}),
      editedOption: null
    })
    this.cv.optsvalidators = {
      title: (val) => {
        if (val.length === 0) {
          return __('mandatory')
        }
        if (val.length > 64) {
          return __('too long')
        }
      },
      content: (val) => {
        if (val.length === 0) {
          return __('mandatory')
        }
      }
    }
    this.cv.validators = Object.assign({
      tags: (val) => {
        if (!val || val.length === 0) {
          return __('mandatory')
        }
      }
    }, this.cv.optsvalidators)
    if (!adding) {
      this.requester.getEntry('proposals', id, {_load: 'options'})
      .then(this.onProposalLoaded.bind(this))
      .catch(this.onError.bind(this))
    } else {
      this._validate('title', this.cv.record.title)
      this._validate('content', this.cv.record.content)
      this._validate('tags', this.cv.record.tags)
    }
  }

  _validateOpt(attr, val) {
    const err = this.cv.optsvalidators[attr](val)
    return err ? this.cv.optionerrors.set(attr, err) : this.cv.optionerrors.delete(attr)
  }

  @action onOptionAttrChange(attr, val) {
    this.cv.editedOption[attr] = val
    this._validateOpt(attr, val)
  }

  @action editOption(opt) {
    this.cv.editedOption = opt ? Object.assign({}, opt) : {
      title: '',
      content: ''
    }
    this._validateOpt('title', this.cv.editedOption.title)
    this._validateOpt('content', this.cv.editedOption.content)
  }

  @computed get propPublishable() {
    return this.cv.errors.size === 0 && this.cv.options.length >= 2
  }

  @computed get propSaveable() {
    return this.cv.errors.size === 0
  }

  @computed get optSaveable() {
    return this.cv.optionerrors.size === 0
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
    this._validate('title', this.cv.record.title)
    this._validate('content', this.cv.record.content)
    this._validate('tags', this.cv.record.tags)
  }

  @action handleProposalFormChange(attr, val) {
    this.cv.record[attr] = val
    this._validate(attr, val)
  }

  _validate(attr, val) {
    const err = this.cv.validators[attr](val)
    return err ? this.cv.errors.set(attr, err) : this.cv.errors.delete(attr)
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
    const adding = this.cv.proposal.feedback === null
    this.cv.proposal.feedback = 'loading'
    const method = adding ? 'post' : 'delete'
    this.requester.call(`/proposals/${this.cv.proposal.id}/feedbacks`, method, {value: 1})
    .then((res) => {
      if (adding) {
        this.cv.proposal.feedback = res.data
        if (this.cv.proposal.status !== res.data.proposal.status) {
          Object.assign(this.cv.proposal, res.data.proposal)
        }
      } else {
        this.cv.proposal.feedback = null
      }
    })
    .catch(this.onError.bind(this))
  }

  @action onReply(comment, reply) {
    comment.reply = reply === null ? '' : '@' + this.userinfos.get(reply.uid).fullname
  }

}

export default ProposalStore
