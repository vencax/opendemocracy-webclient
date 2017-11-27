import { observable, computed, toJS, action, extendObservable } from 'mobx'

export default class VotingStore {
  constructor(requester, onError) {
    this.requester = requester
    this.onError = onError
  }

  @observable myvote = {content: null}
  @observable takingaction = false
  @observable proposal = null

  load(proposal) {
    this.proposal = proposal
    return this.requester.call(`/proposals/${proposal.id}/mycast`)
    .then((res) => {
      if (res.data && res.data.length) {
        this.myvote = res.data[0]
      }
    })
  }

  @action onVoteChange(value) {
    this.myvote.content = value
  }

  @action onVoteSubmit() {
    this.takingaction = true
    const method = this.myvote === undefined ? 'post' : 'put'
    this.requester.call(`/proposals/${this.proposal.id}/casts`, method, this.myvote)
    .then(this.onVoteSubmitted.bind(this))
    .catch(this.onError)
  }

  @action onVoteSubmitted(res) {
    this.myvote = res.data[0]
    this.takingaction = false
  }
}
