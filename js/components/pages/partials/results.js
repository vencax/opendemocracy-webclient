/* global _ */
import React from 'react'
import { observer } from 'mobx-react'

const Results = ({proposal}) => {
  return (
    <ul>
      {
        proposal.results && _.map(proposal.results, (v, k) => {
          const opt = proposal.options.find(o => o.id === Number(k))
          return <li key={v}>{opt.title}: {v}x</li>
        })
      }
    </ul>
  )
}
export default observer(Results)
