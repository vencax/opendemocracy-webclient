import React from 'react'

const SelectOneOptionForm = ({options, value, onChange, enabled}) => {
  //
  try {
    value = value ? JSON.parse(value) : {}
  } catch (_) {
    value = {}
  }
  let total = 0
  Object.keys(value).map(i => total + value[i])

  const o = options ? options.map(i => {
    const id = i.id.toString()
    function _onUp (evt) {
      value[id] = value[id] ? value[id] + 1 : 1
      onChange(JSON.stringify(value))
    }
    function _onDown (evt) {
      value[id] -= 1
      onChange(JSON.stringify(value))
    }
    const up = (
      <a href='javascript:void(0)' onClick={_onUp}>
        <i className='fa fa-thumbs-o-up' />
      </a>
    )
    const down = total > 0 ? (
      <a href='javascript:void(0)' onClick={_onDown}>
        <i className='fa fa-thumbs-o-down' />
      </a>
    ) : null
    const v = value[id] || 0
    return (
      <div className='checkbox'>
        <label>
          {v} x <b>{i.title}</b> {up} {down}
          <p>{i.content}</p>
        </label>
      </div>
    )
  }) : null
  return <div>{o}</div>
}
export default SelectOneOptionForm
