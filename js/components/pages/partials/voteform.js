import React from 'react'
import { observer } from 'mobx-react'
import {__} from '../../../state/i18n'

const VotingForm = ({proposal, onChange, onSubmit, valid = true, enabled = true}) => {
  return (
    <div className='media-left'>
      {
        proposal.options.map(i => {
          function _onChange (evt) {
            onChange(i.id, evt.target.value === 'on')
          }
          const checked = proposal.myvote.has(i.id)
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
        enabled && <button className='btn btn-sm' disabled={!valid} onClick={onSubmit}>{__('vote')}</button>
      }
    </div>
  )
}
export default observer(VotingForm)
