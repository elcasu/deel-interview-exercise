import {
  render,
  screen,
  fireEvent,
  waitFor,
  within
} from '@testing-library/react'
import Finder from './'

describe('Finder component', () => {
  it('renders', async () => {
    render(
      <Finder
        text=''
        list={ [] }
        loading={ false }
        onChange={ () => jest.fn() }
        onItemSelect={ () => jest.fn() }
      />
    )

    expect(screen.getByRole('textbox')).toBeInTheDocument()

    // the dropdown should not appear in the first render
    expect(screen.queryByTestId('filter-items')).not.toBeInTheDocument()
  })

  it('handles user input', async () => {
    const handleChange = jest.fn()

    render(
      <Finder
        text=''
        list={ [] }
        loading={ false }
        onChange={ handleChange }
        onItemSelect={ () => jest.fn() }
      />
    )

    fireEvent.input(screen.getByRole('textbox'), {
      target: { value: 'oxf' }
    })

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith('oxf')
    })
  })

  it('displays the popup if there are items in the list, highlighting the matches', async () => {
    render(
      <Finder
        text='versi'
        list={ [ 'University 1', 'University 2' ] }
        loading={ false }
        onChange={ () => jest.fn() }
        onItemSelect={ () => jest.fn() }
      />
    )

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByTestId('finder-items')).toBeInTheDocument()
    expect(screen.getByTestId('finder-items')).toHaveTextContent('University 1')
    expect(screen.getByTestId('finder-items')).toHaveTextContent('University 2')

    // check that the user input is being highlighted
    expect(within(screen.getByTestId('finder-items')).getAllByTestId('highlight')).toHaveLength(2)
    expect(within(screen.getByTestId('finder-items')).getAllByTestId('highlight')[0]).toHaveTextContent(/^versi$/)
    expect(within(screen.getByTestId('finder-items')).getAllByTestId('highlight')[1]).toHaveTextContent(/^versi$/)
  })

  it('displays a "not found" messages if there is input but no matches', async () => {
    render(
      <Finder
        text='versi'
        list={ [] }
        loading={ false }
        onChange={ () => jest.fn() }
        onItemSelect={ () => jest.fn() }
      />
    )
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.queryByTestId('finder-items')).not.toBeInTheDocument()
    expect(screen.getByText('No results found')).toBeInTheDocument()
  })

  it('displays a "fetching data" message while loading', async () => {
    render(
      <Finder
        text='versi'
        list={ [] }
        loading={ true }
        onChange={ () => jest.fn() }
        onItemSelect={ () => jest.fn() }
      />
    )
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.queryByTestId('finder-items')).not.toBeInTheDocument()
    expect(screen.getByText('Fetching names...')).toBeInTheDocument()
  })

  it('triggers onItemSelect when user selects an item from the list', async () => {
    const handleItemSelect = jest.fn()

    render(
      <Finder
        text='versi'
        list={ [ 'University 1', 'University 2' ] }
        loading={ false }
        onChange={ () => jest.fn() }
        onItemSelect={ handleItemSelect }
      />
    )

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByTestId('finder-items')).toBeInTheDocument()
    expect(screen.getByTestId('finder-items')).toHaveTextContent('University 1')
    expect(screen.getByTestId('finder-items')).toHaveTextContent('University 2')

    // click the first item
    const item = within(screen.getByTestId('finder-items')).getAllByTestId('highlight')[0]
    fireEvent.click(item)
    await waitFor(() => {
      expect(handleItemSelect).toHaveBeenCalledWith('University 1')
    })
  })
})
