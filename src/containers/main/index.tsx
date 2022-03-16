import React, { useState, useMemo } from 'react'
import './styles.css'

import { debounce } from '../../utils'
import Finder from '../../components/finder'
import { fetchNames } from '../../api/university'

const DEBOUNCE_DELAY = 300

function Main() {
  const [ text, setText ] = useState('')
  const [ list, setList ] = useState([])
  const [ loading, setLoading ] = useState(false)

  const getList = async (text: string) => {
    setList(await fetchNames(text))
    setLoading(false)
  }

  const handleTextChange = async (text: string) => {
    setText(text)
    setList([])
    setLoading(true)
    if (text.trim().length > 0) {
      debounceRequest(text)
    }
  }

  const handleItemSelect = (item: string) => {
    setText(item)
    setList([])
  }

  const debounceRequest = useMemo(() => debounce((value: string) => getList(value), DEBOUNCE_DELAY), [])

  return (
    <div className="main-layout">
      <header className="header">
        <h2>University finder</h2>
      </header>
      <main className='body'>
        <div className='title'>
          Please enter part of the name you are looking for
        </div>
        <div className='finder-wrapper'>
          <Finder
            text={ text }
            list={ list }
            loading={ loading }
            onChange={ handleTextChange }
            onItemSelect={ handleItemSelect }
          />
        </div>
      </main>
    </div>
  )
}

export default Main
