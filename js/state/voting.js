import { observable, computed, toJS, action, extendObservable } from 'mobx'

export default class VotingStore {
  constructor(requester, onError) {
    this.requester = requester
    this.onError = onError
  }

  myvote = observable.shallowMap({})
  @observable takingaction = false
  @observable proposal = null

  load(proposal) {
    this.proposal = proposal
    return this.requester.call(`/proposals/${proposal.id}/casts`)
    .then((res) => {
      if (res.data && res.data.length) {
        this.myExistingVote = res.data[0]
        const r = res.data[0].content.split(',').reduce((acc, i) => {
          acc[i] = true
          return acc
        }, {})
        this.myvote.replace(r)
      }
    })
  }

  @action onVoteChange(optid, value) {
    return value ? this.myvote.set(optid, value) : this.myvote.delete(optid)
  }

  @action onVoteSubmit() {
    this.takingaction = true
    const b = this.myvote.keys().join(',')
    const method = this.myExistingVote === undefined ? 'post' : 'put'
    this.requester.call(`/proposals/${this.proposal.id}/casts`, method, {content: b})
    .then(this.onVoteSubmitted.bind(this))
    .catch(this.onError)
  }

  @action onVoteSubmitted(res) {
    this.myExistingVote = res.data
    this.takingaction = false
  }
}
