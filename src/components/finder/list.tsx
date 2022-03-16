import React from 'react'

type listProps = {
  text: string,
  items: Array<string>,
  loading: boolean,
  onItemClick: Function
}

const highlight = (text: string, sentence: string) => {
  const wordRegex = new RegExp(`(${text})`, 'gi')
  const result = sentence.replace(wordRegex, '<span data-testid="highlight">$1</span>')
  return result
}

function List({ text, items, loading, onItemClick }: listProps) {
  const handleItemClick = (item: string) => {
    onItemClick(item)
  }

  if (loading) {
    return (
      <div className='items not-found'>
        Fetching names...
      </div>
    )
  } else if (text.length > 0 && items.length === 0) {
    return (
      <div className='items not-found'>
        No results found
      </div>
    )
  }

  return (
    <div className='items' data-testid='finder-items'>
      {
        items.map((item, index) => (
          <div
            className='item'
            key={ `list-item-${index}` }
            data-testid='finder-item'
            dangerouslySetInnerHTML={{
              __html: highlight(text, item)
            }}
            onClick={ () => handleItemClick(item) }
          />
        ))
      }
    </div>
  )
}

export default List
