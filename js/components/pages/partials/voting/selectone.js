import React from 'react'

const SelectOneOptionForm = ({options, value, onChange, enabled}) => {
  //
  const o = options ? options.map(i => {
    const id = i.id.toString()
    function _onChange (evt) {
      onChange(id)
    }
    const radio = value === id
      ? <input type='radio' onClick={_onChange} checked='checked' disabled={!enabled} />
      : <input type='radio' onClick={_onChange} disabled={!enabled} />
    return (
      <div className='checkbox'>
        <label>
          {radio} <b>{i.title}</b>
          <p>{i.content}</p>
        </label>
      </div>
    )
  }) : null
  return <div>{o}</div>
}
export default SelectOneOptionForm
