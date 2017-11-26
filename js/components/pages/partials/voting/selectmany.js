import React from 'react'

const SelectOneOptionForm = ({options, value, onChange, enabled}) => {
  //
  value = value ? value.split(',') : []

  const o = options ? options.map(i => {
    const idx = value.indexOf(i.id.toString())
    function _onChange (evt) {
      if (evt.target.checked) {
        value.push(i.id)
      } else {
        value.splice(idx, 1)
      }
      onChange(value.join(','))
    }
    const checked = idx >= 0
    return (
      <div className='checkbox'>
        <label>
          <input type='checkbox' onClick={_onChange} checked={checked} disabled={!enabled} /> <b>{i.title}</b>
          <p>{i.content}</p>
        </label>
      </div>
    )
  }) : null
  return <div>{o}</div>
}
export default SelectOneOptionForm
