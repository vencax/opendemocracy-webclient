/* global moment */
import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import {
  FormGroup, ControlLabel, FormControl, HelpBlock, Button
} from 'react-bootstrap'
import DatePicker from 'react-bootstrap-date-picker'
import {Typeahead} from 'react-bootstrap-typeahead'
import {__} from '../../state/i18n'

const ProposalForm = observer(({rec, errors, handleChange, groupinfos}) => {
  function validationState (attr) {
    return errorText(attr) ? 'error' : null
  }
  function errorText (attr) {
    return errors.get(attr)
  }
  const tagOptions = ['zakony', 'neco', 'neco2']
  const groupOptions = []
  groupinfos.forEach((i, id) => {
    groupOptions.push(<option key={id} value={id}>{i}</option>)
  })

  return (
    <div className='col-sm-12 col-md-6'>

      <div className='row'>
        <div className='col-sm-6'>
          <FormGroup controlId='typ'>
            <ControlLabel>{__('type')}</ControlLabel>
            <FormControl componentClass='select' name='typ' disabled={rec.id}
              onChange={(e) => handleChange('typ', e.target.value)} value={rec.typ}>
              <option key={1} value='proposal'>{__('proposal')}</option>
              <option key={2} value='eventdate'>{__('event date')}</option>
            </FormControl>
          </FormGroup>
        </div>
        <div className='col-sm-6'>
          <FormGroup controlId='group'>
            <ControlLabel>{__('group')}</ControlLabel>
            <FormControl componentClass='select' name='group'
              onChange={(e) => handleChange('group', e.target.value)} value={rec.group}>
              <option key={0} value={null} />
              {groupOptions}
            </FormControl>
          </FormGroup>
        </div>
      </div>

      <FormGroup controlId='title' validationState={validationState('title')}>
        <ControlLabel>{__('title')}</ControlLabel>
        <FormControl componentClass='input' name='title'
          onChange={(e) => handleChange('title', e.target.value)} value={rec.title} />
        <FormControl.Feedback />
        {errorText ? <HelpBlock>{errorText('title')}</HelpBlock> : null}
      </FormGroup>

      <FormGroup controlId='content' validationState={validationState('content')}>
        <ControlLabel>{__('content')}</ControlLabel>
        <FormControl componentClass='textarea' rows='10' name='content'
          onChange={(e) => handleChange('content', e.target.value)} value={rec.content} />
        <FormControl.Feedback />
        {errorText ? <HelpBlock>{errorText('content')}</HelpBlock> : null}
      </FormGroup>

      <span>{__('tags')}</span>
      <Typeahead labelKey='tags' multiple options={tagOptions}
        placeholder={__('choose at least one tag')} selected={rec.tags ? rec.tags.split(',') : ''}
        onChange={selected => handleChange('tags', selected.join(','))}
      />
      {errors.has('tags') && <span className='text-danger'>{errors.get('tags')}</span>}
    </div>
  )
})

const DATEFORMAT = 'DD/MM/YYYY'

const OptionsForm = observer(({rec, errors, handleChange, proposaltype}) => {
  function validationState (attr) {
    return errors.has(attr) ? 'error' : null
  }
  function errorText (attr) {
    return errors.get(attr)
  }
  const Input = proposaltype === 'eventdate' ? (
    <DatePicker value={rec.title ? moment(rec.title, DATEFORMAT).format() : null} onChange={(_, val) => {
      handleChange('title', val)
    }} dateFormat={DATEFORMAT} />
  ) : (
    <FormControl componentClass='input' name='title'
      onChange={(e) => handleChange('title', e.target.value)} value={rec.title} />
  )
  return (
    <div>
      <FormGroup controlId='title' validationState={validationState('title')}>
        <ControlLabel>{__('title')}</ControlLabel>
        {Input}
        <FormControl.Feedback />
        {errorText ? <HelpBlock>{errorText('title')}</HelpBlock> : null}
      </FormGroup>

      <FormGroup controlId='content' validationState={validationState('content')}>
        <ControlLabel>{__('content')}</ControlLabel>
        <FormControl componentClass='textarea' rows='10' name='content'
          onChange={(e) => handleChange('content', e.target.value)} value={rec.content} />
        <FormControl.Feedback />
        {errorText ? <HelpBlock>{errorText('content')}</HelpBlock> : null}
      </FormGroup>
    </div>
  )
})

const ProposalEditView = ({store}) => {
  if (store.cv.loading) {
    return <span>loading</span>
  }
  const rec = store.cv.record
  let content
  if (rec.id && rec.status !== 'draft') {
    content = <div>{__('proposal already published, you cannot edit it anymore')}</div>
  } else {
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
                errors={store.cv.optionerrors}
                proposaltype={rec.typ} />
              <Button onClick={store.saveOption.bind(store)} disabled={!store.optSaveable}>{__('save')}</Button>
              <Button onClick={store.cancelEditOption.bind(store)}>{__('cancel')}</Button>
            </div>
          ) : null
        }
      </div>
    ) : <div>{__('save first')}</div>

    content = (
      <div className='discussion'>
        <h1>{rec.id ? __('edit proposal') : __('add new proposal')}</h1>
        <div className='row'>
          <ProposalForm rec={rec} errors={store.cv.errors}
            handleChange={store.handleProposalFormChange.bind(store)}
            groupinfos={store.groupinfos} />
          <div className='col-sm-12 col-md-6'>
            {optsForm}
          </div>
        </div>
        <hr />
        <Button onClick={store.saveProposal.bind(store)} disabled={!store.propSaveable}>{__('save')}</Button>
        { rec.id && <Button onClick={store.publishProposal.bind(store)}
          disabled={!store.propPublishable}>{__('publish')}</Button> }
      </div>
    )
  }

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-xs-12'>
          {content}
        </div>
      </div>
    </div>
  )
}
ProposalEditView.propTypes = {
  store: PropTypes.object.isRequired
}
export default inject('store')(observer(ProposalEditView))
