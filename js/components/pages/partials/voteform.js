import React from 'react'
import { observer } from 'mobx-react'
import {__} from '../../../state/i18n'

const VotingForm = ({store, enabled}) => {
  return (
    <div className='media-left'>
      {
        store.proposal && store.proposal.options.map(i => {
          function _onChange (evt) {
            store.onVoteChange(i.id, evt.target.checked)
          }
          const checked = store.myvote.has(i.id)
          return (
            <div className='checkbox'>
              <label>
                <input type='checkbox' onClick={_onChange} checked={checked} disabled={!enabled} /> <b>{i.title}</b>
                <p>{i.content}</p>
              </label>
            </div>
          )
        })
      }
      {
        enabled && <button className='btn btn-sm' disabled={store.errors || store.takingaction}
          onClick={store.onVoteSubmit.bind(store)}>{__('vote')}</button>
      }
    </div>
  )
}
export default observer(VotingForm)
