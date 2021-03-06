/* global Notification */
import { observable, action } from 'mobx'
import ProposalStore from './proposal'
import {__} from './i18n'

const INTERVAL = 16 * 1000  // 16 secs

if (Notification && Notification.permission === 'default') {
  Notification.requestPermission()
}

class NotificationStore extends ProposalStore {

  startPollingNotifications() {
    this.refresh()
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
        if (i.evt === 'newvoting') {
          const n = new Notification(__('a new voting'), {
            body: i.title,
            icon: 'https://cdn2.iconfinder.com/data/icons/app-types-in-grey/512/info_512pxGREY.png',
          })
          n.onclick = () => {
            this.onNotifClicked(i)
            n.close()
          }
        }
      }
    })
  }

  @observable notifications = []

  @action onNotifClicked(notif) {
    const toRemove = this.notifications.find(i => i.id === notif.id)
    this.notifications.remove(toRemove)
    this.requester.call(`/notifications/${notif.id}`, 'post').catch(() => {})
    switch (notif.evt) {
      case 'propsuport':
        this.goTo('proposal', {id: notif.objid}, {_page: 1})
        break
      case 'newvoting':
        this.goTo('proposal', {id: notif.objid}, {_page: 1})
        break
    }
  }

}

export default NotificationStore
