import { observable, computed, toJS, action, extendObservable } from 'mobx'
import AuthStore from './auth'

class ProposalStore extends AuthStore {

  @action showProposal(id, page = 1) {
    this.cv = observable({
      proposal: null,
      discussionid: id
    })

    this.requester.getEntry('proposals', id)
    .then(action('onProposalLoaded', (proposal) => {
      proposal.comments = []
      proposal.comment = null
      this.cv.proposal = proposal
      return this.loadComments(this.cv, this.cv.proposal, page, 2)
    }))
    .catch(this.onError.bind(this))
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

}

export default ProposalStore
