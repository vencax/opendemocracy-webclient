import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import {
  FormGroup, ControlLabel, FormControl, HelpBlock, Button
} from 'react-bootstrap'

const ProposalForm = observer(({rec, errors, handleChange}) => {
  function validationState (attr) {
    return errorText(attr) ? 'error' : null
  }
  function errorText (attr) {
    return errors.get(attr)
  }
  return (
    <form>
      <FormGroup controlId='title' validationState={validationState('title')}>
        <ControlLabel>title</ControlLabel>
        <FormControl componentClass='input' name='title'
          onChange={(e) => handleChange('title', e.target.value)} value={rec.title} />
        <FormControl.Feedback />
        {errorText ? <HelpBlock>{errorText('title')}</HelpBlock> : null}
      </FormGroup>

      <FormGroup controlId='content' validationState={validationState('content')}>
        <ControlLabel>content</ControlLabel>
        <FormControl componentClass='textarea' name='content'
          onChange={(e) => handleChange('content', e.target.value)} value={rec.content} />
        <FormControl.Feedback />
        {errorText ? <HelpBlock>{errorText('content')}</HelpBlock> : null}
      </FormGroup>
    </form>
  )
})

const ProposalEditView = ({store}) => {
  const rec = store.cv.record

  return store.cv.loading ? <span>loading</span> : (
    <div className='discussion'>
      <h1>{rec.id ? 'add new proposal' : 'edit proposal'}</h1>
      <ProposalForm rec={rec} errors={store.cv.errors}
        handleChange={store.handleProposalFormChange.bind(store)} />
      <hr />
      <Button onClick={store.saveProposal.bind(store)}>save</Button>
    </div>
  )
}
ProposalEditView.propTypes = {
  store: PropTypes.object.isRequired
}
export default inject('store')(observer(ProposalEditView))
