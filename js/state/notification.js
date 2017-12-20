import { observable, action } from 'mobx'
import ProposalStore from './proposal'
import {__} from './i18n'

const INTERVAL = 16 * 1000  // 16 secs

class NotificationStore extends ProposalStore {

  startPollingNotifications() {
    this.interval = setInterval(this.refresh.bind(this), INTERVAL)
  }

  stopPollingNotifications() {
    clearInterval(this.interval)
  }

  refresh() {
    this.requester.call('/notifications')
    .then(this.onRefreshed.bind(this))
    .catch(() => {})
  }

  @action onRefreshed(data) {
    data.data.map(i => {
      const found = this.notifications.find(j => j.id === i.id)
      if (!found) {
        this.notifications.push(i)
      }
    })
  }

  @observable notifications = []

  @action onNotifClicked(notif) {
    this.notifications.remove(notif)
    this.requester.call(`/notifications/${notif.id}`, 'post').catch(() => {})
    switch (notif.evt) {
      case 'propsuport':
        this.goTo('proposal', {id: notif.objid}, {_page: 1})
        break
    }
  }

}

export default NotificationStore
