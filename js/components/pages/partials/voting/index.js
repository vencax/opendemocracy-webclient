import React from 'react'
import { observer } from 'mobx-react'
import {__} from '../../../../state/i18n'
import SelectManyForm from './selectmany'
import GiveSupportForm from './givesupport'
import SelectOneForm from './selectone'

const VotingForm = ({store, enabled}) => {
  var Form = null
  switch (store.proposal.votingtyp) {
    case 'givesupport':
      Form = GiveSupportForm
      break
    case 'selectmany':
      Form = SelectManyForm
      break
    default:
      Form = SelectOneForm
  }

  return (
    <div className='media-left'>
      <Form options={store.proposal.options} value={store.myvote.content}
        onChange={store.onVoteChange.bind(store)} enabled={enabled} />
      {
        enabled && <button className='btn btn-sm' disabled={store.errors || store.takingaction}
          onClick={store.onVoteSubmit.bind(store)}>{__('vote')}</button>
      }
    </div>
  )
}
export default observer(VotingForm)
