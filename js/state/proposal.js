import { observable, computed, toJS, action, extendObservable } from 'mobx'
import AuthStore from './auth'

class ProposalStore extends AuthStore {

  @action showProposal(id) {
    this.cv = observable({
      discussion: null,
      discussionid: id
    })
    this.loadDiscussion(this.cv, id, {entityname: 'proposals'})
    .catch(this.onError.bind(this))
  }

  @action editProposal(id) {
    const adding = id === '_new'
    this.cv = observable({
      loading: adding ? false : true,
      record: adding ? {
        title: '',
        content: '',
        options: [],
      } : null,
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

  @action addOption() {
    this.cv.editedOption = {
      title: '',
      content: ''
    }
  }

  @action onOptionAttrChange(attr, val) {
    this.cv.editedOption[attr] = val
  }

  @action editOption(opt) {
    this.cv.editedOption = Object.assign({}, opt)
  }

  @action saveOption() {
    if (this.cv.editedOption.id) {
      const existing = this.cv.record.options.find((i) => i.id === this.cv.editedOption.id)
      Object.assign(existing, this.cv.editedOption)
    } else {
      this.cv.record.options.push(this.cv.editedOption)
    }
    this.cv.editedOption = null
  }

  @action cancelEditOption() {
    this.cv.editedOption = null
  }

  @action onProposalLoaded(proposal) {
    this.cv.loading = false
    this.cv.record = proposal
  }

  @action handleProposalFormChange(attr, val) {
    this.cv.record[attr] = val
  }

  @action saveProposal() {
    this.cv.loading = true
    this.requester.saveEntry('proposals', this.cv.record, this.cv.record.id)
    .then((data) => {
      this.addMessage('saved')
      this.cv.loading = false
    })
    .catch(this.onError.bind(this))
  }

}

export default ProposalStore
