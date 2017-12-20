import { observable, action } from 'mobx'
import ProposalStore from './proposal'
import {__} from './i18n'

const INTERVAL = 16 * 1000  // 16 secs

class NotificationStore extends ProposalStore {

  constructor() {
    super()
    setInterval(this.refresh.bind(this), INTERVAL)
  }

  refresh() {
    this.requester.call('/notifications')
    .then(this.onRefreshed)
    .catch(() => {})
  }

  @action onRefreshed(data) {
    data.map(i => this.notifications.push(i))
  }

  @observable notifications = []

}

export default NotificationStore
