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
    <div className='col-sm-12 col-md-6'>
      <FormGroup controlId='title' validationState={validationState('title')}>
        <ControlLabel>title</ControlLabel>
        <FormControl componentClass='input' name='title'
          onChange={(e) => handleChange('title', e.target.value)} value={rec.title} />
        <FormControl.Feedback />
        {errorText ? <HelpBlock>{errorText('title')}</HelpBlock> : null}
      </FormGroup>

      <FormGroup controlId='content' validationState={validationState('content')}>
        <ControlLabel>content</ControlLabel>
        <FormControl componentClass='textarea' rows='10' name='content'
          onChange={(e) => handleChange('content', e.target.value)} value={rec.content} />
        <FormControl.Feedback />
        {errorText ? <HelpBlock>{errorText('content')}</HelpBlock> : null}
      </FormGroup>
    </div>
  )
})

const OptionsForm = observer(({rec, errors, handleChange}) => {
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
        <FormControl componentClass='textarea' rows='10' name='content'
          onChange={(e) => handleChange('content', e.target.value)} value={rec.content} />
        <FormControl.Feedback />
        {errorText ? <HelpBlock>{errorText('content')}</HelpBlock> : null}
      </FormGroup>
    </form>
  )
})

const ProposalEditView = ({store}) => {
  if (store.cv.loading) {
    return <span>loading</span>
  }
  const rec = store.cv.record
  const optsForm = rec.id ? (
    <div>
      <h5>options</h5>
      <Button onClick={store.editOption.bind(store, null)}>add</Button>
      {
        store.cv.options.length > 0 ? (
          <ul>
            {
              store.cv.options.map((i) => (
                <div>
                  <h3>{i.title}</h3>
                  <Button onClick={store.removeOption.bind(store, i)}>rem</Button>
                  <Button onClick={store.editOption.bind(store, i)}>edit</Button>
                  <p>{i.content}</p>
                </div>
              ))
            }
          </ul>
        ) : <div>no options</div>
      }
      {
        store.cv.editedOption ? (
          <div>
            <OptionsForm rec={store.cv.editedOption}
              handleChange={store.onOptionAttrChange.bind(store)}
              errors={store.cv.optionerrors} />
            <Button onClick={store.saveOption.bind(store)}>save</Button>
            <Button onClick={store.cancelEditOption.bind(store)}>cancel</Button>
          </div>
        ) : null
      }
    </div>
  ) : <div>save first</div>

  return (
    <div className='discussion'>
      <h1>{rec.id ? 'edit proposal' : 'add new proposal'}</h1>
      <div className='row'>
        <ProposalForm rec={rec} errors={store.cv.errors}
          handleChange={store.handleProposalFormChange.bind(store)} />
        <div className='col-sm-12 col-md-6'>
          {optsForm}
        </div>
      </div>
      <hr />
      <Button onClick={store.saveProposal.bind(store)}>save</Button>
    </div>
  )
}
ProposalEditView.propTypes = {
  store: PropTypes.object.isRequired
}
export default inject('store')(observer(ProposalEditView))
