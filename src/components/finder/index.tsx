import React, { useState } from 'react'

import List from './list'
import './styles.css'

type finderProps = {
  text: string,
  list: Array<string>,
  loading: boolean,
  onChange: (item: string, shouldFetch?: boolean) => void,
  onItemSelect: (item: string) => void
}

function Finder({ text, list, loading, onChange, onItemSelect }: finderProps) {
  const [ selected, setSelected ] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(false)
    onChange(e.target.value)
  }

  const handleItemClick = (item: string) => {
    setSelected(true)
    onItemSelect(item)
  }

  return (
    <div className='finder'>
      <input type='text' value={ text } onChange={ handleChange } />
      {
        !!text.length && !selected && (
          <List text={ text } items={ list } loading={ loading } onItemClick={ handleItemClick } />
        )
      }
    </div>
  )
}

export default Finder
